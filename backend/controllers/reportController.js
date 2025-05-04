const mongoose = require("mongoose");
const Account = require("../models/accountModel");
const Compound = require("../models/compoundModel");
const Expense = require("../models/expenseModel");
const Revenue = require("../models/revenueModel");
const Contract = require("../models/contractModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

// Financial Reports (Lessor)

exports.getIncomeReport = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const { landlord, startDate, endDate, estate, compound } = req.body;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const account = await Account.findById(accountId)
    .select("isVIP isFinancialReportsAllowed")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (!account.isFinancialReportsAllowed && !account.isVIP) {
    return next(
      new ApiError("Your Subscription does not allow this feature", 403)
    );
  }

  const match = {
    status: "paid",
    paidAt: { $gte: start, $lte: end },
    account: accountId,
  };

  if (landlord) {
    match.landlord = new mongoose.Types.ObjectId(landlord);
  }

  if (estate) {
    match.estate = new mongoose.Types.ObjectId(estate);
  }

  if (compound && !estate) {
    match.compound = new mongoose.Types.ObjectId(compound);
  }

  const [revenues, expenses] = await Promise.all([
    Revenue.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$estate",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "estates",
          localField: "_id",
          foreignField: "_id",
          as: "estateDetails",
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          // estateId: "$_id",
          estateName: { $arrayElemAt: ["$estateDetails.name", 0] },
        },
      },
    ]),

    Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $ifNull: ["$estate", "$compound"] },
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "estates",
          localField: "_id",
          foreignField: "_id",
          as: "estateDetails",
        },
      },
      {
        $lookup: {
          from: "compounds",
          localField: "_id",
          foreignField: "_id",
          as: "compoundDetails",
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          estateName: { $arrayElemAt: ["$estateDetails.name", 0] },
          compoundName: { $arrayElemAt: ["$compoundDetails.name", 0] },
        },
      },
    ]),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      revenues,
      expenses,
    },
  });
});

exports.getIncomeDetailsReport = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const { landlord, startDate, endDate, estate, compound } = req.body;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const account = await Account.findById(accountId)
    .select("isVIP isFinancialReportsAllowed")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (!account.isFinancialReportsAllowed && !account.isVIP) {
    return next(
      new ApiError("Your Subscription does not allow this feature", 403)
    );
  }

  const filter = {
    status: "paid",
    paidAt: { $gte: start, $lte: end },
    account: accountId,
  };

  if (landlord) {
    filter.landlord = landlord;
  }

  if (estate) {
    filter.estate = estate;
  }

  if (compound && !estate) {
    filter.compound = compound;
  }

  const popOptions = [
    {
      path: "estate",
      select: "name",
    },
    {
      path: "compound",
      select: "name",
    },
  ];

  const revenuesPopOptions = popOptions.concat([
    {
      path: "tenant",
      select: "name",
    },
  ]);

  const selectedFields = "note amount type paidAt paymentMethod";

  const [revenues, expenses] = await Promise.all([
    Revenue.find(filter)
      .select(selectedFields)
      .populate(revenuesPopOptions)
      .lean(),
    Expense.find(filter).select(selectedFields).populate(popOptions).lean(),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      revenues,
      expenses,
    },
  });
});

exports.getPaymentsReport = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const { landlord, startDueDate, endDueDate, estate, compound, status } =
    req.body;

  const start = new Date(startDueDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDueDate);
  end.setHours(23, 59, 59, 999);

  const account = await Account.findById(accountId)
    .select("isVIP isFinancialReportsAllowed")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (!account.isFinancialReportsAllowed && !account.isVIP) {
    return next(
      new ApiError("Your Subscription does not allow this feature", 403)
    );
  }

  const filter = {
    dueDate: { $gte: start, $lte: end },
    account: accountId,
  };

  if (landlord) {
    filter.landlord = landlord;
  }

  if (estate) {
    filter.estate = estate;
  }

  if (compound && !estate) {
    filter.compound = compound;
  }

  if (status) {
    filter.status = status;
  }

  const popOptions = [
    {
      path: "estate",
      select: "name",
    },
    {
      path: "compound",
      select: "name",
    },
  ];

  const selectedFields =
    "note amount type paidAt paymentMethod dueDate status contact";

  const [revenues, expenses] = await Promise.all([
    Revenue.find(filter)
      .select(selectedFields)
      .populate(popOptions.concat([{ path: "tenant", select: "name" }]))
      .lean(),
    Expense.find(filter).select(selectedFields).populate(popOptions).lean(),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      revenues,
      expenses,
    },
  });
});

// Operational Reports

exports.getContractsReport = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const { landlord, startDueDate, endDueDate, estate, compound, status } =
    req.body;

  const start = new Date(startDueDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDueDate);
  end.setHours(23, 59, 59, 999);

  const account = await Account.findById(accountId)
    .select("isVIP isOperationalReportsAllowed")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (!account.isOperationalReportsAllowed && !account.isVIP) {
    return next(
      new ApiError("Your Subscription does not allow this feature", 403)
    );
  }

  const filter = {
    account: accountId,
    startDate: { $lte: end },
    endDate: { $gte: start },
  };

  if (landlord) {
    filter.landlord = landlord;
  }

  if (estate) {
    filter.estate = estate;
  }

  if (compound && !estate) {
    filter.compound = compound;
  }

  if (status) {
    filter.status = status;
  }

  const popOptions = [
    {
      path: "tenant",
      select: "name phone",
    },
    {
      path: "estate",
      select: "name",
    },
  ];

  const selectedFields =
    "startDate endDate totalAmount paymentPeriodValue paymentPeriodUnit status";

  const contracts = await Contract.find(filter)
    .select(selectedFields)
    .populate(popOptions)
    .lean();

  res.status(200).json({
    status: "success",
    data: contracts,
  });
});

// Compounds Reports

exports.getCompoundsReport = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const { startDate, endDate, landlord, compoundsIds } = req.body;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const account = await Account.findById(accountId)
    .select("isVIP isCompoundsReportsAllowed")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (!account.isCompoundsReportsAllowed && !account.isVIP) {
    return next(
      new ApiError("Your Subscription does not allow this feature", 403)
    );
  }

  const match = {
    compound: { $exists: true, $ne: null },
    status: "paid",
    paidAt: { $gte: start, $lte: end },
    account: accountId,
  };

  if (landlord) {
    match.landlord = new mongoose.Types.ObjectId(landlord);
  }

  if (compoundsIds && compoundsIds.length) {
    match.compound = {
      $in: compoundsIds.map((id) => new mongoose.Types.ObjectId(id)),
      $exists: true,
      $ne: null,
    };
  }

  const [revenues, expenses] = await Promise.all([
    Revenue.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$compound",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "compounds",
          localField: "_id",
          foreignField: "_id",
          as: "compoundDetails",
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          compoundName: { $arrayElemAt: ["$compoundDetails.name", 0] },
        },
      },
    ]),

    Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$compound",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "compounds",
          localField: "_id",
          foreignField: "_id",
          as: "compoundDetails",
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          compoundName: { $arrayElemAt: ["$compoundDetails.name", 0] },
        },
      },
    ]),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      revenues,
      expenses,
    },
  });
});

exports.getCompoundDetailsReport = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const { startDate, endDate, compoundId } = req.body;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const account = await Account.findById(accountId)
    .select("isVIP isCompoundsReportsAllowed")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (!account.isCompoundsReportsAllowed && !account.isVIP) {
    return next(
      new ApiError("Your Subscription does not allow this feature", 403)
    );
  }

  const popOptions = [
    {
      path: "broker",
      select: "name phone phone2 notes",
    },
    {
      path: "landlord",
      select: "name phone phone2 notes",
    },
  ];

  const [compound, revenuesAggregate, expensesAggregate] = await Promise.all([
    Compound.findById(compoundId).populate(popOptions).lean(),

    Revenue.aggregate([
      {
        $match: {
          compound: new mongoose.Types.ObjectId(String(compoundId)),
          dueDate: { $gte: start, $lte: end },
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
    ]),

    Expense.aggregate([
      {
        $match: {
          compound: new mongoose.Types.ObjectId(String(compoundId)),
          dueDate: { $gte: start, $lte: end },
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
    ]),
  ]);

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
      compound,
    },
  });
});
