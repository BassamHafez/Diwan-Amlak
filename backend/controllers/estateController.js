const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const mongoose = require("mongoose");

const Account = require("../models/accountModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const Expense = require("../models/expenseModel");
const Revenue = require("../models/revenueModel");
const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../utils/uploadImage");

const estatesPopOptions = [
  {
    path: "compound",
    select: "name region city",
  },
];

const estatePopOptions = [
  {
    path: "broker",
    select: "name phone phone2 notes",
  },
  {
    path: "landlord",
    select: "name phone phone2 notes",
  },
];

const estatesSelectFields =
  "compound name description region city image inFavorites status tags unitNumber commissionPercentage";

const compoundSelectFields =
  "name address region city neighborhood image commissionPercentage";

exports.getAllEstates = factory.getAll(
  Estate,
  estatesPopOptions,
  estatesSelectFields
);

exports.getEstate = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;

  const account = await Account.findById(req.user.account)
    .select("subscriptionEndDate")
    .lean();

  if (account.subscriptionEndDate < new Date()) {
    return next(new ApiError("Your subscription has expired", 403));
  }

  const estatePromise = Estate.findOne({
    _id: estateId,
    account: req.user.account,
  })
    .populate(estatePopOptions)
    .lean();

  const revenuesAggregatePromise = Revenue.aggregate([
    {
      $match: {
        estate: new mongoose.Types.ObjectId(String(estateId)),
      },
    },
    {
      $group: {
        _id: null,
        totalPaid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
        },
      },
    },
  ]);

  const expensesAggregatePromise = Expense.aggregate([
    {
      $match: {
        estate: new mongoose.Types.ObjectId(String(estateId)),
      },
    },
    {
      $group: {
        _id: null,
        totalPaid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
        },
      },
    },
  ]);

  const [estate, revenuesAggregate, expensesAggregate] = await Promise.all([
    estatePromise,
    revenuesAggregatePromise,
    expensesAggregatePromise,
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  let compound = null;

  if (estate.compound) {
    compound = await Compound.findById(estate.compound)
      .select(compoundSelectFields)
      .populate(estatePopOptions)
      .lean();
  }

  const [
    { totalPaid: totalPaidRevenues, totalPending: totalPendingRevenues } = {
      totalPaid: 0,
      totalPending: 0,
    },
  ] = revenuesAggregate;

  const [
    { totalPaid: totalPaidExpenses, totalPending: totalPendingExpenses } = {
      totalPaid: 0,
      totalPending: 0,
    },
  ] = expensesAggregate;

  res.status(200).json({
    status: "success",
    data: {
      totalRevenue: totalPaidRevenues + totalPendingRevenues,
      totalPaidRevenues,
      totalPendingRevenues,
      totalExpense: totalPaidExpenses + totalPendingExpenses,
      totalPaidExpenses,
      totalPendingExpenses,
      estate,
      compound,
    },
  });
});

exports.uploadEstateImage = uploadSingleImage("image");

exports.resizeEstateImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `estate-${uuidv4()}.png`;

  if (req.file && req.file.buffer) {
    await sharp(req.file.buffer)
      // .resize(2000, 1333)
      .toFormat("png")
      .png({ quality: 99 })
      .toFile(`uploads/estates/${filename}`);

    req.body.image = `/estates/${filename}`;
  }

  next();
});

exports.createEstate = catchAsync(async (req, res, next) => {
  const { tags } = req.body;

  const account = await Account.findById(req.user.account)
    .select("isVIP allowedEstates maxEstatesInCompound subscriptionEndDate")
    .lean();

  if (account.subscriptionEndDate < new Date()) {
    return next(new ApiError("Your subscription has expired", 403));
  }

  if (!account.isVIP && account.allowedEstates <= 0) {
    return next(new ApiError("Subscribe and get more estates", 403));
  }

  if (req.body.compound) {
    const compound = await Compound.findById(req.body.compound);

    if (!compound) {
      return next(new ApiError("No compound found with that ID", 404));
    }

    if (compound.estatesCount >= account.maxEstatesInCompound) {
      return next(new ApiError("Max estates reached for this compound", 403));
    }

    req.body.unitNumber = +compound.estatesCount + 1;

    if (req.body.region) delete req.body.region;
    if (req.body.city) delete req.body.city;
    if (req.body.neighborhood) delete req.body.neighborhood;
    if (req.body.broker) delete req.body.broker;
    if (req.body.commissionPercentage) delete req.body.commissionPercentage;
    if (req.body.landlord) delete req.body.landlord;
  }

  const estateCreatePromise = Estate.create(req.body);

  const estateCountUpdatePromise = req.body.compound
    ? Compound.findByIdAndUpdate(
        req.body.compound,
        { $inc: { estatesCount: 1 } },
        { lean: true }
      )
    : Promise.resolve();

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { account: req.user.account },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const accountUpdatePromise = Account.findByIdAndUpdate(req.user.account, {
    $inc: { allowedEstates: -1 },
  });

  const [estate] = await Promise.all([
    estateCreatePromise,
    tagUpdatePromise,
    estateCountUpdatePromise,
    accountUpdatePromise,
  ]);

  res.status(201).json({
    status: "success",
    data: estate,
  });
});

exports.updateEstate = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;
  const { tags } = req.body;

  const [account, estate] = await Promise.all([
    Account.findById(req.user.account).select("subscriptionEndDate").lean(),

    Estate.findOne({ _id: estateId, account: req.user.account })
      .select("compound")
      .lean(),
  ]);

  if (account.subscriptionEndDate < new Date()) {
    return next(new ApiError("Your subscription has expired", 403));
  }

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (estate.compound) {
    if (req.body.region) delete req.body.region;
    if (req.body.city) delete req.body.city;
    if (req.body.neighborhood) delete req.body.neighborhood;
    if (req.body.broker) delete req.body.broker;
    if (req.body.commissionPercentage) delete req.body.commissionPercentage;
    if (req.body.landlord) delete req.body.landlord;
  }

  const estateUpdatePromise = Estate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true, populate: estatePopOptions }
  );

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { account: req.user.account },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const updateRevenuesPromise = req.body?.landlord
    ? Revenue.updateMany(
        { estate: estateId, compound: null },
        { landlord: req.body.landlord }
      )
    : Promise.resolve();

  const updateExpensesPromise = req.body?.landlord
    ? Expense.updateMany(
        { estate: estateId, compound: null },
        { landlord: req.body.landlord }
      )
    : Promise.resolve();

  const [_, updatedEstate] = await Promise.all([
    tagUpdatePromise,
    estateUpdatePromise,
    updateRevenuesPromise,
    updateExpensesPromise,
  ]);

  if (!updatedEstate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedEstate,
  });
});

exports.deleteEstate = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;

  const estate = await Estate.findOne({
    _id: estateId,
    account: req.user.account,
  });

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  const estateDeletePromise = Estate.findByIdAndDelete(req.params.id);

  const estateCountUpdatePromise = estate.compound
    ? Compound.findByIdAndUpdate(
        estate.compound,
        { $inc: { estatesCount: -1 } },
        { lean: true }
      )
    : Promise.resolve();

  await Promise.all([estateDeletePromise, estateCountUpdatePromise]);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Favorites

exports.favoriteEstate = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.user.account)
    .select("isFavoriteAllowed subscriptionEndDate")
    .lean();

  if (account.subscriptionEndDate < new Date()) {
    return next(new ApiError("Your subscription has expired", 403));
  }

  if (!account.isVIP && !account.isFavoriteAllowed) {
    return next(new ApiError("Subscribe in favorite feature first", 403));
  }

  const estate = await Estate.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { inFavorites: true }
  );

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Estate added to favorites",
  });
});

exports.unfavoriteEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { inFavorites: false }
  );

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Estate removed from favorites",
  });
});

// Estate expenses

exports.getEstateExpenses = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;

  const estatePromise = Estate.findOne({
    _id: estateId,
    account: req.user.account,
  })
    .select("_id")
    .lean();

  const expensesPromise = Expense.find({ estate: estateId })
    .select("note amount dueDate type status paidAt paymentMethod contact")
    .sort("dueDate")
    .lean();

  const [estate, expenses] = await Promise.all([
    estatePromise,
    expensesPromise,
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: expenses,
  });
});

exports.createEstateExpense = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;

  const estate = await Estate.findById(estateId)
    .select("_id compound landlord")
    .lean();

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  req.body.estate = estateId;
  if (estate.compound) req.body.compound = estate.compound;
  if (estate.landlord) req.body.landlord = estate.landlord;

  if (!req.body.landlord && estate.compound) {
    const compound = await Compound.findById(estate.compound)
      .select("landlord")
      .lean();

    if (compound.landlord) req.body.landlord = compound.landlord;
  }

  const expense = await Expense.create(req.body);

  res.status(201).json({
    status: "success",
    data: expense,
  });
});
