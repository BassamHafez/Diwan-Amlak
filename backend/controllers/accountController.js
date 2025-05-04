const mongoose = require("mongoose");
const axios = require("axios");
const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Package = require("../models/packageModel");
const Subscription = require("../models/subscriptionModel");
const Purchase = require("../models/purchaseModel");
const Compound = require("../models/compoundModel");
const Estate = require("../models/estateModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { sendWAText } = require("../utils/sendWAMessage");
const sendEmail = require("../utils/sendEmail");
const { newMemberHtml } = require("../utils/htmlMessages");
const { formatSaudiNumber } = require("../utils/formatNumbers");
const { getSubscriptionPrice } = require("../utils/subscribeHelpers");

const store = process.env.TELR_STORE_ID;
const authkey = process.env.TELR_AUTH_KEY;
const authorised = process.env.TELR_AUTHORISED_URL;
const declined = process.env.TELR_DECLINED_URL;
const cancelled = process.env.TELR_CANCELLED_URL;
const test = process.env.NODE_ENV !== "production" ? "1" : "0";

const memberPopOptions = {
  path: "members.user",
  select: "name email phone photo",
};

const ownerPopOptions = {
  path: "owner",
  select: "name email phone",
};

exports.getAllAccounts = factory.getAll(Account, ownerPopOptions, "-members");
exports.updateAccount = factory.updateOne(Account);

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const account = await Account.findById(id).select("members").lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  const membersIds = account.members.map((member) => member.user);

  await Promise.all([
    User.deleteMany({ _id: { $in: membersIds } }, { ordered: false }),
    Account.deleteOne({ _id: id }),
    ScheduledMission.deleteMany({ account: id }),
  ]);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMyAccount = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.user.account)
    .populate(memberPopOptions)
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    account.members.forEach((member) => {
      delete member.permissions;
      delete member.permittedCompounds;
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});

exports.getMyPurchases = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.find({ account: req.user.account })
    .select("amount status type customPackage date billInfo")
    .lean();

  res.status(200).json({
    status: "success",
    data: {
      purchases,
    },
  });
});

exports.checkPurchaseStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let retryCount = 0;
  const maxRetries = 2;
  const retryDelay = 1500; // 1.5 sec

  async function attemptCheck() {
    const purchase = await Purchase.findById(id).select("status").lean();

    if (!purchase) {
      return next(new ApiError("Purchase not found", 404));
    }

    if (purchase.status !== "completed" && retryCount < maxRetries) {
      retryCount++;

      await new Promise((resolve) => setTimeout(resolve, retryDelay));

      return attemptCheck();
    }

    res.status(200).json({
      status: purchase.status === "completed" ? "COMPLETED" : "NOT_COMPLETED",
    });
  }

  await attemptCheck();
});

exports.subscribe = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { usersCount, compoundsCount, estatesCount, maxEstatesInCompound } =
    req.body;
  let cost = 0;

  const expireDate = new Date(Date.now() + 30.25 * 24 * 60 * 60 * 1000);

  const accountData = {
    subscriptionEndDate: expireDate,
  };

  if (compoundsCount > 0 && estatesCount < 1) {
    return next(
      new ApiError("You must subscribe to estates to manage compounds", 400)
    );
  }

  const [account, subscriptions, existEstatesCount, compoundAggregation] =
    await Promise.all([
      Account.findById(id).populate("owner", "name phone email").lean(),
      Subscription.find().lean(),
      Estate.countDocuments({ account: id }).lean(),

      Compound.aggregate([
        {
          $match: { account: new mongoose.Types.ObjectId(id) },
        },
        {
          $group: {
            _id: null,
            existCompoundsCount: { $sum: 1 },
            maxExistEstates: { $max: "$estatesCount" },
          },
        },
      ]),
    ]);

  const [
    { existCompoundsCount, maxExistEstates } = {
      existCompoundsCount: 0,
      maxExistEstates: 0,
    },
  ] = compoundAggregation;

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner._id.toString() !== req.user.id) {
    return next(new ApiError("Owner of the account can only subscribe", 403));
  }

  if (account.isVIP) {
    return next(new ApiError("VIP account can't subscribe", 403));
  }

  if (!subscriptions || !subscriptions.length) {
    return next(new ApiError("Error getting subscription plans", 500));
  }

  if (existCompoundsCount > compoundsCount) {
    return next(
      new ApiError("Subscribed compounds less than the existing compounds", 400)
    );
  }

  if (existEstatesCount > estatesCount) {
    return next(
      new ApiError("Subscribed estates less than the existing estates", 400)
    );
  }

  if (account.members?.length > usersCount) {
    return next(
      new ApiError("Subscribed users less than the existing members", 400)
    );
  }

  if (maxExistEstates > maxEstatesInCompound) {
    return next(
      new ApiError(
        "Max estates in compound less than existing max estates",
        400
      )
    );
  }

  if (usersCount && usersCount >= 1) {
    const userPrice = getSubscriptionPrice(subscriptions, "ADD_USER");

    cost += userPrice * usersCount;
    accountData.allowedUsers = usersCount;
  } else {
    accountData.allowedUsers = 0;
  }

  if (compoundsCount && compoundsCount >= 1) {
    let compoundFeature = "ADD_COMPOUND_LESS_THAN_10";

    if (compoundsCount < 10) {
      compoundFeature = "ADD_COMPOUND_LESS_THAN_10";
    } else if (compoundsCount >= 10 && compoundsCount < 30) {
      compoundFeature = "ADD_COMPOUND_10_30";
    } else if (compoundsCount >= 30 && compoundsCount < 50) {
      compoundFeature = "ADD_COMPOUND_30_50";
    } else {
      compoundFeature = "ADD_COMPOUND_MORE_THAN_50";
    }

    const compoundPrice = getSubscriptionPrice(subscriptions, compoundFeature);

    cost += compoundPrice * compoundsCount;
    accountData.allowedCompounds = compoundsCount;
  } else {
    return next(new ApiError("You must subscribe to compounds", 400));
  }

  if (estatesCount && estatesCount >= 1) {
    let estateFeature = "ADD_ESTATE_LESS_THAN_10";

    if (estatesCount < 10) {
      estateFeature = "ADD_ESTATE_LESS_THAN_10";
    } else if (estatesCount >= 10 && estatesCount < 30) {
      estateFeature = "ADD_ESTATE_10_30";
    } else if (estatesCount >= 30 && estatesCount < 50) {
      estateFeature = "ADD_ESTATE_30_50";
    } else {
      estateFeature = "ADD_ESTATE_MORE_THAN_50";
    }

    const estatePrice = getSubscriptionPrice(subscriptions, estateFeature);

    cost += estatePrice * estatesCount;
    accountData.allowedEstates = estatesCount;
  } else {
    accountData.allowedEstates = 0;
  }

  if (maxEstatesInCompound) {
    let maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_3";
    accountData.maxEstatesInCompound = maxEstatesInCompound;

    if (maxEstatesInCompound > 3 && maxEstatesInCompound <= 10) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_10";
      accountData.maxEstatesInCompound = 10;
    } else if (maxEstatesInCompound > 10 && maxEstatesInCompound <= 30) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_30";
      accountData.maxEstatesInCompound = 30;
    } else if (maxEstatesInCompound > 30 && maxEstatesInCompound <= 50) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_50";
      accountData.maxEstatesInCompound = 50;
    } else {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_300";
      accountData.maxEstatesInCompound = 300;
    }

    const maxEstatesPrice = getSubscriptionPrice(
      subscriptions,
      maxEstatesFeature
    );

    cost += maxEstatesPrice;
  }

  const booleanFeatures = [
    { key: "isFavoriteAllowed", feature: "FAVORITES" },
    { key: "isRemindersAllowed", feature: "REMINDERS" },
    { key: "isAnalysisAllowed", feature: "ANALYSIS" },
    { key: "isFinancialReportsAllowed", feature: "FINANCIAL_REPORTS" },
    { key: "isOperationalReportsAllowed", feature: "OPERATIONAL_REPORTS" },
    { key: "isCompoundsReportsAllowed", feature: "COMPOUNDS_REPORTS" },
    { key: "isTasksAllowed", feature: "TASKS" },
    { key: "isFilesExtractAllowed", feature: "FILES_EXTRACT" },
    { key: "isServiceContactsAllowed", feature: "SERVICE_CONTACTS" },
    { key: "isUserPermissionsAllowed", feature: "USER_PERMISSIONS" },
  ];

  for (const { key, feature } of booleanFeatures) {
    const val = Boolean(req.body[key]);

    if (val) {
      const price = getSubscriptionPrice(subscriptions, feature);
      cost += price;
    }
    accountData[key] = val;
  }

  if (!cost) {
    return next(new ApiError("Invalid subscription", 400));
  }

  const purchaseId = new mongoose.Types.ObjectId();

  const options = {
    method: "POST",
    url: "https://secure.telr.com/gateway/order.json",
    headers: { accept: "application/json", "Content-Type": "application/json" },
    data: {
      method: "create",
      store,
      authkey,
      framed: 0,
      order: {
        cartid: purchaseId.toString(),
        test,
        amount: cost,
        currency: "SAR",
        description: "custom subscription",
      },
      return: {
        authorised,
        declined,
        cancelled,
      },
    },
  };

  const { data } = await axios.request(options);

  if (!data || data.error || !data.order) {
    return next(new ApiError("Error getting payment link", 500));
  }

  const { order } = data;
  const { ref, url } = order;

  await Purchase.create({
    _id: purchaseId,
    account: id,
    amount: cost,
    type: "custom",
    customPackage: req.body,
    accountData,
    telrRef: ref,
  });

  res.status(200).json({
    status: "success",
    data: {
      paymentUrl: url,
      purchaseId,
      purchaseRef: ref,
      amount: cost,
    },
  });
});

exports.subscribeInPackage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { packageId } = req.body;

  const [account, package, existEstatesCount, compoundAggregation] =
    await Promise.all([
      Account.findById(id).populate("owner", "name phone email").lean(),
      Package.findById(packageId).select("features price duration").lean(),
      Estate.countDocuments({ account: id }).lean(),

      Compound.aggregate([
        {
          $match: { account: new mongoose.Types.ObjectId(id) },
        },
        {
          $group: {
            _id: null,
            existCompoundsCount: { $sum: 1 },
            maxExistEstates: { $max: "$estatesCount" },
          },
        },
      ]),
    ]);

  const [
    { existCompoundsCount, maxExistEstates } = {
      existCompoundsCount: 0,
      maxExistEstates: 0,
    },
  ] = compoundAggregation;

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner._id.toString() !== req.user.id) {
    return next(new ApiError("Owner of the account can only subscribe", 403));
  }

  if (account.isVIP) {
    return next(new ApiError("VIP account can't subscribe", 403));
  }

  if (!package) {
    return next(new ApiError("Package not found", 404));
  }

  const features = package.features.reduce((acc, feature) => {
    acc[feature.label] = feature.value;
    return acc;
  }, {});

  if (existCompoundsCount > +features.allowedCompounds) {
    return next(
      new ApiError("Package compounds less than the existing compounds", 400)
    );
  }

  if (existEstatesCount > +features.allowedEstates) {
    return next(
      new ApiError("Package estates less than the existing estates", 400)
    );
  }

  if (account.members?.length > +features.allowedUsers) {
    return next(
      new ApiError("Package users less than the existing members", 400)
    );
  }

  if (maxExistEstates > +features.maxEstatesInCompound) {
    return next(
      new ApiError(
        "Max estates in compound less than existing max estates",
        400
      )
    );
  }

  const purchaseId = new mongoose.Types.ObjectId();

  const options = {
    method: "POST",
    url: "https://secure.telr.com/gateway/order.json",
    headers: { accept: "application/json", "Content-Type": "application/json" },
    data: {
      method: "create",
      store,
      authkey,
      framed: 0,
      order: {
        cartid: purchaseId.toString(),
        test,
        amount: package.price,
        currency: "SAR",
        description: "package subscription",
      },
      return: {
        authorised,
        declined,
        cancelled,
      },
    },
  };

  const { data } = await axios.request(options);
  const { order } = data;
  const { ref, url } = order;

  const expireDate = new Date(
    Date.now() + package.duration * 30.25 * 24 * 60 * 60 * 1000 // 30 days + 6 hours
  );

  await Purchase.create({
    _id: purchaseId,
    account: id,
    amount: package.price,
    type: "package",
    package: packageId,
    accountData: {
      features,
      expireDate,
    },
    telrRef: ref,
  });

  res.status(200).json({
    status: "success",
    data: {
      paymentUrl: url,
      purchaseId,
      purchaseRef: ref,
      amount: package.price,
    },
  });
});

exports.addMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const account = await Account.findById(id)
    .select("isVIP allowedUsers isUserPermissionsAllowed owner")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(new ApiError("Owner of the account can only add members", 403));
  }

  if (!account.isVIP && account.allowedUsers <= 0) {
    return next(new ApiError("Subscribe to add more users", 403));
  }

  if (
    !account.isVIP &&
    req.body?.permissions?.length > 0 &&
    !account.isUserPermissionsAllowed
  ) {
    return next(
      new ApiError("Your Subscription doesn't allow adding permissions", 403)
    );
  }

  const userData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    account: id,
    permittedCompounds: req.body.permittedCompounds || [],
    permissions: req.body.permissions,
  };

  const user = await User.create(userData);

  const html = newMemberHtml(req.body.phone, req.body.password);

  await Promise.all([
    Account.findByIdAndUpdate(id, {
      $push: {
        members: {
          user: user._id,
          tag: req.body.tag,
          permissions: req.body.permissions,
          permittedCompounds: req.body.permittedCompounds || [],
        },
      },
      $inc: { allowedUsers: -1 },
    }),

    sendWAText(
      formatSaudiNumber(req.body.phone),
      `Welcome to your new account on Diiwan.com. Your account has been created successfully. Your login credentials are as follows: \nPhone: ${req.body.phone}\nPassword: ${req.body.password}
      
      \n\n
      أهلاً بك في حسابك الجديد على Diiwan.com. تم إنشاء حسابك بنجاح. بيانات تسجيل الدخول الخاصة بك هي كالتالي: \nالهاتف: ${req.body.phone}\nكلمة المرور: ${req.body.password}
      `
    ),

    sendEmail(
      req.body.email,
      "Welcome to Diiwan",
      `Welcome to your new account on Diiwan.com. Your account has been created successfully. Your login credentials are as follows: \nPhone: ${req.body.phone}\nPassword: ${req.body.password}`,
      html
    ),
  ]);

  res.status(201).json({
    status: "success",
    message: "Member added successfully",
  });
});

exports.updateMember = catchAsync(async (req, res, next) => {
  const { id, userId } = req.params;

  const account = await Account.findById(id)
    .select("owner isUserPermissionsAllowed")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(
      new ApiError("Owner of the account can only update members", 403)
    );
  }

  if (userId === account.owner.toString()) {
    return next(new ApiError("Owner of the account can't be updated", 403));
  }

  if (
    !account.isVIP &&
    req.body?.permissions?.length > 0 &&
    !account.isUserPermissionsAllowed
  ) {
    return next(
      new ApiError("Your Subscription doesn't allow adding permissions", 403)
    );
  }

  const modifiedUserFields = {};
  const modifiedAccountFields = {};

  if (req.body.tag) {
    modifiedAccountFields["members.$.tag"] = req.body.tag;
  }
  if (req.body.permissions) {
    modifiedAccountFields["members.$.permissions"] = req.body.permissions;
    modifiedUserFields.permissions = req.body.permissions;
  }
  if (req.body.permittedCompounds) {
    modifiedAccountFields["members.$.permittedCompounds"] =
      req.body.permittedCompounds;
    modifiedUserFields.permittedCompounds = req.body.permittedCompounds;
  }

  const [user] = await Promise.all([
    User.findOneAndUpdate({ _id: userId, account: id }, modifiedUserFields),

    Account.updateOne(
      { _id: id, "members.user": userId },
      { $set: modifiedAccountFields }
    ),
  ]);

  if (!user) {
    return next(new ApiError("Member not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Member updated successfully",
  });
});

exports.deleteMember = catchAsync(async (req, res, next) => {
  const { id, userId } = req.params;

  const account = await Account.findById(id).select("owner").lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(
      new ApiError("Owner of the account can only delete members", 403)
    );
  }

  if (userId === account.owner.toString()) {
    return next(new ApiError("Owner of the account can't be deleted", 403));
  }

  const [user] = await Promise.all([
    User.findOneAndDelete({ _id: userId, account: id }),

    Account.findByIdAndUpdate(id, {
      $pull: { members: { user: userId } },
      $inc: { allowedUsers: 1 },
    }),
  ]);

  if (!user) {
    return next(new ApiError("Member not found", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Member deleted successfully",
  });
});

exports.addVIP = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const expireDate = new Date(
    Date.now() + req.body.months * 30.25 * 24 * 60 * 60 * 1000 // 30 days + 6 hours
  );

  const [updatedAccount] = await Promise.all([
    Account.findByIdAndUpdate(id, {
      isVIP: true,
      subscriptionEndDate: expireDate,
    }).populate("owner", "name phone email"),

    ScheduledMission.deleteOne({
      account: id,
      type: "SUBSCRIPTION_EXPIRATION",
      isDone: false,
    }),
  ]);

  if (!updatedAccount) {
    return next(new ApiError("Account not found", 404));
  }

  await Promise.all([
    ScheduledMission.create({
      account: id,
      accountOwner: updatedAccount.owner,
      type: "SUBSCRIPTION_EXPIRATION",
      scheduledAt: expireDate,
    }),

    Purchase.create({
      account: id,
      amount: req.body.price,
      type: "vip",
      vipMonths: req.body.months,
    }),
  ]);

  sendWAText(
    formatSaudiNumber(updatedAccount.owner.phone),
    `Your account at Diiwan.com is now VIP. Your VIP subscription will end at ${expireDate.toLocaleString()}.

    \n\n
    حسابك في Diiwan.com الآن VIP. سينتهي اشتراكك VIP في ${expireDate.toLocaleString()}.
    `
  );

  res.status(200).json({
    status: "success",
    message: "Account is now VIP",
  });
});

exports.telrWebhook = catchAsync(async (req, res, next) => {
  // console.log("webhook body", req.body);

  const {
    tran_store,
    tran_type,
    tran_class,
    tran_test,
    tran_ref,
    tran_prevref,
    tran_firstref,
    tran_currency,
    tran_amount,
    tran_cartid,
    tran_desc,
    tran_status,
    tran_authcode,
    tran_authmessage,
    tran_check,
    card_code,
    card_payment,
    bin_number,
    card_issuer,
    card_country,
    card_last4,
    card_check,
    cart_lang,
    integration_id,
    actual_payment_date,
    bill_fname,
    bill_sname,
    bill_addr1,
    bill_city,
    bill_country,
    bill_email,
    bill_phone1,
    bill_check,
  } = req.body;

  amount = parseFloat(tran_amount);

  if (tran_type !== "sale" && tran_status !== "A" && tran_status !== "H") {
    return res.status(400);
  }

  const purchase = await Purchase.findById(tran_cartid).populate({
    path: "account",
    populate: {
      path: "owner",
      select: "name email phone",
    },
  });

  if (!purchase) {
    return res.status(404);
  }

  purchase.status = "completed";
  purchase.paymentInfo = {
    tran_store,
    tran_type,
    tran_class,
    tran_test,
    tran_ref,
    tran_prevref,
    tran_firstref,
    tran_currency,
    tran_amount: amount,
    tran_desc,
    tran_status,
    tran_authcode,
    tran_authmessage,
    tran_check,
    card_code,
    card_payment,
    bin_number,
    card_issuer,
    card_country,
    card_last4,
    card_check,
    cart_lang,
    integration_id,
    actual_payment_date: new Date(actual_payment_date),
  };
  purchase.billInfo = {
    bill_fname,
    bill_sname,
    bill_addr1,
    bill_city,
    bill_country,
    bill_email,
    bill_phone1,
  };

  switch (purchase.type) {
    case "custom":
      await processCustomSubscription(purchase);
      break;
    case "package":
      await processPackageSubscription(purchase);
      break;
    case "vip":
      // await processVIPSubscription(purchase);
      break;
    default:
      return res.status(400);
  }

  return res.status(200);
});

async function processCustomSubscription(purchase) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Account.findByIdAndUpdate(
      purchase.account._id,
      purchase.accountData,
      { session }
    );

    await ScheduledMission.deleteOne(
      {
        account: purchase.account._id,
        type: "SUBSCRIPTION_EXPIRATION",
        isDone: false,
      },
      { session }
    );

    const expireDate = purchase.accountData.subscriptionEndDate;

    await purchase.save({ session });

    await ScheduledMission.create(
      [
        {
          account: purchase.account._id,
          accountOwner: purchase.account.owner,
          type: "SUBSCRIPTION_EXPIRATION",
          scheduledAt: expireDate,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await sendWAText(
      formatSaudiNumber(purchase.account.owner.phone),
      `Your subscription at Diiwan.com has been updated successfully. Your new subscription will end at ${expireDate.toLocaleString()}.
  
        \n\n
        تم تحديث اشتراكك في Diiwan.com بنجاح. سينتهي اشتراكك الجديد في ${expireDate.toLocaleString()}.
        `
    );
  } catch (error) {
    await session.abortTransaction();
    throw error; // Re-throw the error for further handling
  } finally {
    session.endSession();
  }
}

async function processPackageSubscription(purchase) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { expireDate, features } = purchase.accountData;

    await Account.findByIdAndUpdate(
      purchase.account._id,
      {
        subscriptionEndDate: expireDate,

        allowedUsers: parseInt(features.allowedUsers) || 0,
        allowedCompounds: parseInt(features.allowedCompounds) || 0,
        allowedEstates: parseInt(features.allowedEstates) || 0,
        maxEstatesInCompound: parseInt(features.maxEstatesInCompound),
        isFavoriteAllowed: Boolean(features.isFavoriteAllowed),
        isRemindersAllowed: Boolean(features.isRemindersAllowed),
        isAnalysisAllowed: Boolean(features.isAnalysisAllowed),
        isFinancialReportsAllowed: Boolean(features.isFinancialReportsAllowed),
        isOperationalReportsAllowed: Boolean(
          features.isOperationalReportsAllowed
        ),
        isCompoundsReportsAllowed: Boolean(features.isCompoundsReportsAllowed),
        isTasksAllowed: Boolean(features.isTasksAllowed),
        isFilesExtractAllowed: Boolean(features.isFilesExtractAllowed),
        isServiceContactsAllowed: Boolean(features.isServiceContactsAllowed),
        isUserPermissionsAllowed: Boolean(features.isUserPermissionsAllowed),
      },
      { session }
    );

    await ScheduledMission.deleteOne(
      {
        account: purchase.account._id,
        type: "SUBSCRIPTION_EXPIRATION",
        isDone: false,
      },
      { session }
    );

    await purchase.save({ session });

    await ScheduledMission.create(
      [
        {
          account: purchase.account._id,
          accountOwner: purchase.account.owner,
          type: "SUBSCRIPTION_EXPIRATION",
          scheduledAt: expireDate,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await sendWAText(
      formatSaudiNumber(purchase.account.owner.phone),
      `Your subscription at Diiwan.com has been updated successfully. Your new subscription will end at ${expireDate.toLocaleString()}.
  
        \n\n
        تم تحديث اشتراكك في Diiwan.com بنجاح. سينتهي اشتراكك الجديد في ${expireDate.toLocaleString()}.`
    );
  } catch (error) {
    await session.abortTransaction();
    throw error; // Re-throw the error for further handling
  } finally {
    session.endSession();
  }
}
