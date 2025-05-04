const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Purchase = require("../models/purchaseModel");
const Compound = require("../models/compoundModel");
const Estate = require("../models/estateModel");
const Revenue = require("../models/revenueModel");
const Expense = require("../models/expenseModel");
const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.getStats = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  // const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1); // 1st Jan next year
  const endOfYear = new Date(new Date().getFullYear(), 11, 31); // 31st Dec this year

  const account = await Account.findById(accountId)
    .select("isAnalysisAllowed isVIP")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (!account.isAnalysisAllowed && !account.isVIP) {
    return next(
      new ApiError("Your Subscription does not allow this feature", 403)
    );
  }

  const estatesAggregatePromise = Estate.aggregate([
    { $match: { account: accountId } },
    {
      $group: {
        _id: null,
        totalEstates: { $sum: 1 },
        rentedEstates: {
          $sum: { $cond: [{ $eq: ["$status", "rented"] }, 1, 0] },
        },
      },
    },
  ]);

  const revenuesAggregatePromise = Revenue.aggregate([
    { $match: { account: accountId } },
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
    { $match: { account: accountId } },
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

  const tasksFilter = {
    account: accountId,
    isCompleted: false,
    date: {
      $lte: new Date().setHours(23, 59, 59, 999),
    },
  };

  const todayFilter = {
    account: accountId,
    dueDate: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lt: new Date().setHours(23, 59, 59, 999),
    },
  };

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

  const todayAndBeforeTasksPromise = Task.find(tasksFilter)
    .select("title description date type cost priority isCompleted")
    .populate(popOptions)
    .lean();

  const todayRevenuesPromise = Revenue.find(todayFilter)
    .select("note amount dueDate type status")
    .populate(popOptions)
    .lean();

  const exPendingRevenuesPromise = Revenue.find({
    account: accountId,
    status: "pending",
    dueDate: { $lt: new Date() },
  })
    .select("note amount dueDate type status")
    .populate(popOptions)
    .lean();

  const todayExpensesPromise = Expense.find(todayFilter)
    .select("note amount dueDate type status")
    .populate(popOptions)
    .lean();

  const revenuesByMonthPromise = Revenue.aggregate([
    {
      $match: {
        account: accountId,
        dueDate: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { $month: "$dueDate" },
        totalPaid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalPaid: 1,
        totalPending: 1,
      },
    },
  ]);

  const [
    estatesAggregate,
    revenuesAggregate,
    expensesAggregate,
    todayAndBeforeTasks,
    todayRevenues,
    exPendingRevenues,
    todayExpenses,
    revenuesByMonth,
  ] = await Promise.all([
    estatesAggregatePromise,
    revenuesAggregatePromise,
    expensesAggregatePromise,
    todayAndBeforeTasksPromise,
    todayRevenuesPromise,
    exPendingRevenuesPromise,
    todayExpensesPromise,
    revenuesByMonthPromise,
  ]);

  const [
    { totalEstates, rentedEstates } = { totalEstates: 0, rentedEstates: 0 },
  ] = estatesAggregate;

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
      totalPaidRevenues,
      totalPendingRevenues,
      totalPaidExpenses,
      totalPendingExpenses,
      totalEstatesCount: totalEstates,
      rentedEstatesCount: rentedEstates,
      todayAndBeforeTasks,
      todayRevenues,
      exPendingRevenues,
      todayExpenses,
      revenuesByMonth,
    },
  });
});

exports.getAdminStats = catchAsync(async (req, res, next) => {
  const accountsCountPromise = Account.countDocuments();
  const usersCountPromise = User.countDocuments();
  const compoundsCountPromise = Compound.countDocuments();
  const estatesCountPromise = Estate.countDocuments();

  const purchasesStatsPromise = Purchase.aggregate([
    {
      $facet: {
        // Total Revenue
        totalRevenue: [
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ],
        // Total Pending Transactions and Total Completed Transactions
        transactionStatusCounts: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              amount: { $sum: "$amount" },
            },
          },
        ],
        // Number of Purchases and Average Purchase Amount
        generalStats: [
          {
            $group: {
              _id: null,
              totalPurchases: { $sum: 1 },
              averageAmount: { $avg: "$amount" },
            },
          },
        ],
        // Purchase Counts and Average Purchase Amount by Type
        typeStats: [
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
              averageAmount: { $avg: "$amount" },
            },
          },
        ],
        // Top 5 Accounts by Spend
        topAccounts: [
          { $match: { status: "completed" } },
          { $group: { _id: "$account", totalSpend: { $sum: "$amount" } } },
          { $sort: { totalSpend: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "accounts",
              localField: "_id",
              foreignField: "_id",
              as: "account",
            },
          },
          {
            $project: {
              _id: 0,
              totalSpend: 1,
              accountName: {
                $arrayElemAt: [{ $ifNull: ["$account.name", ["Unknown"]] }, 0],
              },
            },
          },
        ],
        // Most Popular Package
        popularPackages: [
          { $match: { type: "package", package: { $ne: null } } },
          { $group: { _id: "$package", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
          {
            $lookup: {
              from: "packages",
              localField: "_id",
              foreignField: "_id",
              as: "package",
            },
          },
          {
            $project: {
              _id: 0,
              count: 1,
              package: {
                $arrayElemAt: ["$package", 0],
              },
            },
          },
          {
            $project: {
              numberOfPurchases: "$count",
              arTitle: "$package.arTitle",
              enTitle: "$package.enTitle",
            },
          },
        ],
      },
    },
    {
      $project: {
        // Simplify the output
        totalRevenue: { $arrayElemAt: ["$totalRevenue.total", 0] },
        pendingTransactions: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$transactionStatusCounts",
                as: "status",
                cond: { $eq: ["$$status._id", "pending"] },
              },
            },
            0,
          ],
        },
        completedTransactions: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$transactionStatusCounts",
                as: "status",
                cond: { $eq: ["$$status._id", "completed"] },
              },
            },
            0,
          ],
        },
        generalStats: { $arrayElemAt: ["$generalStats", 0] },
        typeStats: "$typeStats",
        topAccounts: "$topAccounts",
        mostPopularPackage: { $arrayElemAt: ["$popularPackages", 0] },
      },
    },
  ]);

  const [
    accountsCount,
    usersCount,
    compoundsCount,
    estatesCount,
    purchasesStats,
  ] = await Promise.all([
    accountsCountPromise,
    usersCountPromise,
    compoundsCountPromise,
    estatesCountPromise,
    purchasesStatsPromise,
  ]);

  const [
    {
      totalRevenue: totalCompletedRevenue,
      pendingTransactions: {
        count: totalPendingTransactions,
        amount: totalPendingAmount,
      },
      completedTransactions: {
        count: totalCompletedTransactions,
        amount: totalCompletedAmount,
      },
      generalStats: {
        totalPurchases: numberOfPurchases,
        averageAmount: averagePurchaseAmount,
      },
      typeStats,
      topAccounts: topAccountsBySpend,
      mostPopularPackage,
    },
  ] = purchasesStats;

  let customPackagePurchaseCount = 0;
  let customPackagePurchaseAmount = 0;
  let packagesPurchaseCount = 0;
  let packagesPurchaseAmount = 0;

  typeStats.forEach((type) => {
    if (type._id === "custom") {
      customPackagePurchaseCount = type.count;
      customPackagePurchaseAmount = type.averageAmount;
    } else if (type._id === "package") {
      packagesPurchaseCount = type.count;
      packagesPurchaseAmount = type.averageAmount;
    }
  });

  res.status(200).json({
    status: "success",
    data: {
      accountsCount,
      usersCount,
      compoundsCount,
      estatesCount,
      totalCompletedRevenue,
      totalPendingTransactions,
      totalPendingAmount,
      totalCompletedTransactions,
      totalCompletedAmount,
      numberOfPurchases,
      averagePurchaseAmount,
      customPackagePurchaseCount,
      customPackagePurchaseAmount,
      packagesPurchaseCount,
      packagesPurchaseAmount,
      topAccountsBySpend,
      mostPopularPackage,
    },
  });
});
