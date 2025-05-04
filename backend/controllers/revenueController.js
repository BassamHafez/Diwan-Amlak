const mongoose = require("mongoose");
const Account = require("../models/accountModel");
const Revenue = require("../models/revenueModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { sendWAText } = require("../utils/sendWAMessage");
const { formatSaudiNumber } = require("../utils/formatNumbers");

const revenuePopOptions = [
  {
    path: "tenant",
    select: "name phone phone2",
  },
];

exports.getAllRevenues = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const revenues = await Revenue.find({ estate: estateId })
    .populate(revenuePopOptions)
    .sort("dueDate")
    .lean();

  res.status(200).json({
    status: "success",
    results: revenues.length,
    data: revenues,
  });
});

exports.createRevenue = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const [estate, account] = await Promise.all([
    Estate.findById(estateId).select("compound landlord").lean(),
    Account.findById(req.user.account)
      .select("isVIP isRemindersAllowed subscriptionEndDate")
      .lean(),
  ]);

  if (account.subscriptionEndDate < new Date()) {
    return next(new ApiError("Your subscription has expired", 403));
  }

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (estate.compound) req.body.compound = estate.compound;

  if (estate.landlord) req.body.landlord = estate.landlord;

  if (!req.body.landlord && estate.compound) {
    const compound = await Compound.findById(estate.compound)
      .select("landlord")
      .lean();

    req.body.landlord = compound.landlord;
  }

  const revenueId = new mongoose.Types.ObjectId();
  const createRevenuePromise = Revenue.create({
    _id: revenueId,
    ...req.body,
    estate: estateId,
    account: req.user.account,
  });

  const scheduleTaskPromise =
    account && (account.isRemindersAllowed || account.isVIP)
      ? ScheduledMission.create({
          type: "REVENUE_REMINDER",
          scheduledAt: new Date(req.body.dueDate).setHours(8, 0, 0, 0),
          revenue: revenueId,
        })
      : Promise.resolve();

  await Promise.all([createRevenuePromise, scheduleTaskPromise]);

  res.status(201).json({
    status: "success",
    message: "Revenue created successfully",
  });
});

exports.cancelRevenue = catchAsync(async (req, res, next) => {
  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "canceled", paidAt: null, paymentMethod: null }
  );

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  await ScheduledMission.deleteOne({ revenue: req.params.id, isDone: false });

  res.status(200).json({
    status: "success",
    message: "Revenue canceled successfully",
  });
});

exports.payRevenue = catchAsync(async (req, res, next) => {
  const { paymentMethod, paidAt } = req.body;

  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "paid", paidAt, paymentMethod }
  ).populate(revenuePopOptions.concat([{ path: "estate", select: "name" }]));

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  const removePendingMissionPromise = ScheduledMission.deleteOne({
    revenue: req.params.id,
    isDone: false,
  });

  const sendWAMsgPromise =
    updatedRevenue.tenant && updatedRevenue.tenant.phone
      ? sendWAText(
          formatSaudiNumber(updatedRevenue.tenant.phone),
          `${updatedRevenue.amount} SAR received for "${
            updatedRevenue.estate.name
          }" on (${new Date(paidAt).toLocaleDateString()})

          \n\n
          ${updatedRevenue.amount} ريال تم استلامها لـ "${
            updatedRevenue.estate.name
          }" في (${new Date(paidAt).toLocaleDateString()})`
        )
      : Promise.resolve();

  await Promise.all([removePendingMissionPromise, sendWAMsgPromise]);

  res.status(200).json({
    status: "success",
    message: "Revenue marked as paid successfully",
  });
});

exports.unpayRevenue = catchAsync(async (req, res, next) => {
  const [updatedRevenue, account] = await Promise.all([
    Revenue.findOneAndUpdate(
      { _id: req.params.id, account: req.user.account },
      { status: "pending", paidAt: null, paymentMethod: null }
    ),
    Account.findById(req.user.account).select("isRemindersAllowed").lean(),
  ]);

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  if (
    account &&
    (account.isRemindersAllowed || account.isVIP) &&
    updatedRevenue.dueDate > new Date()
  ) {
    await ScheduledMission.create({
      type: "REVENUE_REMINDER",
      scheduledAt: new Date(updatedRevenue.dueDate).setHours(8, 0, 0, 0),
      revenue: req.params.id,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Revenue marked as unpaid successfully",
  });
});

exports.deleteRevenue = catchAsync(async (req, res, next) => {
  const revenue = await Revenue.findOneAndDelete({
    _id: req.params.id,
    account: req.user.account,
  });

  if (!revenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  await ScheduledMission.deleteOne({ revenue: req.params.id, isDone: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.splitRevenue = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { splitedAmount, dueDate, note = "" } = req.body;

  const revenue = await Revenue.findOne({
    _id: id,
    account: req.user.account,
  }).lean();

  if (!revenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  if (+splitedAmount >= +revenue.amount) {
    return next(
      new ApiError("Splited amount must be less than the original amount", 400)
    );
  }

  const newRevenueData = {
    amount: splitedAmount,
    dueDate,
    type: revenue.type,
    note,
    estate: revenue.estate,
    account: revenue.account,
  };

  if (revenue.compound) newRevenueData.compound = revenue.compound;
  if (revenue.landlord) newRevenueData.landlord = revenue.landlord;
  if (revenue.tenant) newRevenueData.tenant = revenue.tenant;
  if (revenue.contract) newRevenueData.contract = revenue.contract;

  await Promise.all([
    Revenue.create(newRevenueData),
    Revenue.updateOne({ _id: id }, { $inc: { amount: -1 * splitedAmount } }),
  ]);

  res.status(201).json({
    status: "success",
    message: "Revenue splited successfully",
  });
});
