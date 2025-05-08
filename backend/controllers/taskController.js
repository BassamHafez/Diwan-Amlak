const mongoose = require("mongoose");
const Task = require("../models/taskModel");
const Account = require("../models/accountModel");
const Expense = require("../models/expenseModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const taskPopOptions = [
  {
    path: "estate",
    select: "name",
  },
  {
    path: "compound",
    select: "name",
  },
  {
    path: "contact",
    select: "name phone phone2",
  },
];

exports.checkTasksPermission = async (req, res, next) => {
  if (req.user && req.user.account) {
    const account = await Account.findById(req.user.account)
      .select("isTasksAllowed isVIP")
      .lean();

    if (!account) {
      return next(new ApiError("Account not found", 404));
    }

    if (!account.isTasksAllowed && !account.isVIP) {
      return next(
        new ApiError("Your Subscription does not allow this feature", 403)
      );
    }
  }
  next();
};

exports.getAllTasks = factory.getAll(Task, taskPopOptions);
exports.getTask = factory.getOne(Task, taskPopOptions);
exports.updateTask = factory.updateOne(Task);
exports.deleteTask = factory.deleteOne(Task);

exports.completeTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { isCompleted } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { isCompleted, completedAt: isCompleted ? new Date() : null },
    { new: true }
  );

  if (!updatedTask) {
    return next(new ApiError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedTask,
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const { type } = req.body;
  let task;

  if (type === "reminder") {
    task = await Task.create(req.body);

    return res.status(201).json({
      status: "success",
      data: task,
    });
  }
  const { estate, compound, cost, date, contact } = req.body;

  if (estate && compound) {
    return next(
      new ApiError("Only one of 'estate' or 'compound' can be set", 400)
    );
  }

  if (estate || compound) {
    const expenseId = new mongoose.Types.ObjectId();

    const account = await Account.findById(req.user.account)
      .select("isVIP isRemindersAllowed")
      .lean();

    const scheduleTaskPromise =
      account && (account.isRemindersAllowed || account.isVIP)
        ? ScheduledMission.create({
            type: "EXPENSE_REMINDER",
            scheduledAt: new Date(date).setHours(10, 0, 0, 0),
            expense: expenseId,
          })
        : Promise.resolve();

    const expenseData = {
      _id: expenseId,
      amount: cost,
      dueDate: date,
      contact,
      type,
      estate,
      compound,
      account: req.user.account,
    };

    [task] = await Promise.all([
      Task.create(req.body),

      Expense.create(expenseData),

      scheduleTaskPromise,
    ]);
  }

  if (!task) {
    task = await Task.create(req.body);
  }

  res.status(201).json({
    status: "success",
    data: task,
  });
});
