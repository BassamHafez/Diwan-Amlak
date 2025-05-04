const mongoose = require("mongoose");
const Account = require("../models/accountModel");
const Expense = require("../models/expenseModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const expensePopOptions = [
  {
    path: "estate",
    select: "name",
  },
  {
    path: "compound",
    select: "name",
  },
];

exports.getAllExpenses = factory.getAll(Expense, expensePopOptions);
exports.getExpense = factory.getOne(Expense, expensePopOptions);
exports.updateExpense = factory.updateOne(Expense);

exports.createExpense = catchAsync(async (req, res, next) => {
  const { estate, compound } = req.body;

  const account = await Account.findById(req.user.account)
    .select("isRemindersAllowed subscriptionEndDate isVIP")
    .lean();

  if (account.subscriptionEndDate < new Date()) {
    return next(new ApiError("Your subscription has expired", 403));
  }

  if (estate && !compound) {
    const estateData = await Estate.findById(estate)
      .select("compound landlord")
      .lean();

    if (!estateData) {
      return next(new ApiError("No estate found with that ID", 404));
    }

    if (estateData.compound) req.body.compound = estateData.compound;
    if (estateData.landlord) req.body.landlord = estateData.landlord;

    if (!req.body.landlord && estateData.compound) {
      const compoundData = await Compound.findById(estateData.compound)
        .select("landlord")
        .lean();

      if (compoundData.landlord) req.body.landlord = compoundData.landlord;
    }
  } else if (compound && !estate) {
    const compoundData = await Compound.findById(compound)
      .select("landlord")
      .lean();

    if (!compoundData) {
      return next(new ApiError("No compound found with that ID", 404));
    }

    if (compoundData.landlord) req.body.landlord = compoundData.landlord;
  }

  const expenseId = new mongoose.Types.ObjectId();

  const scheduleTaskPromise =
    account && !account.isVIP && account.isRemindersAllowed
      ? ScheduledMission.create({
          type: "EXPENSE_REMINDER",
          scheduledAt: new Date(req.body.dueDate).setHours(10, 0, 0, 0),
          expense: expenseId,
        })
      : Promise.resolve();

  await Promise.all([
    Expense.create({ _id: expenseId, ...req.body }),
    scheduleTaskPromise,
  ]);

  res.status(201).json({
    status: "success",
    message: "Expense created successfully",
  });
});

exports.cancelExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, status: { $ne: "paid" } },
    { status: "cancelled" }
  );

  if (!updatedExpense) {
    return next(new ApiError("No unpaid expense found with that ID", 404));
  }

  await ScheduledMission.deleteOne({ expense: id, isDone: false });

  res.status(200).json({
    status: "success",
    message: "Expense canceled successfully",
  });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedExpense = await Expense.deleteOne({
    _id: id,
    account: req.user.account,
  });

  if (!deletedExpense.deletedCount) {
    return next(new ApiError("No expense found with that ID", 404));
  }

  await ScheduledMission.deleteOne({ expense: id, isDone: false });

  res.status(204).json({
    status: "success",
    message: "Expense deleted successfully",
  });
});

exports.payExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { paidAt, paymentMethod } = req.body;

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, status: { $ne: "cancelled" } },
    { status: "paid", paidAt, paymentMethod }
  );

  if (!updatedExpense) {
    return next(
      new ApiError("No un cancelled expense found with that ID", 404)
    );
  }

  await ScheduledMission.deleteOne({ expense: id, isDone: false });

  res.status(200).json({
    status: "success",
    message: "Expense paid successfully",
  });
});

exports.unpayExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [updatedExpense, account] = await Promise.all([
    await Expense.findByIdAndUpdate(id, {
      status: "pending",
      paidAt: null,
      paymentMethod: null,
    }),
    Account.findById(req.user.account).select("isRemindersAllowed").lean(),
  ]);

  if (!updatedExpense) {
    return next(new ApiError("No expense found with that ID", 404));
  }

  if (
    account &&
    !account.isVIP &&
    account.isRemindersAllowed &&
    updatedExpense.dueDate > new Date()
  ) {
    await ScheduledMission.create({
      type: "EXPENSE_REMINDER",
      scheduledAt: new Date(updatedExpense.dueDate).setHours(10, 0, 0, 0),
      expense: id,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Expense marked as unpaid successfully",
  });
});
