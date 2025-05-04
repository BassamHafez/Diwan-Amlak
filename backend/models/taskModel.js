const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    date: {
      type: Date,
      default: new Date(),
    },
    estate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
    },
    compound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compound",
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceContact",
    },
    type: {
      type: String,
      enum: ["purchases", "maintenance", "reminder", "other"],
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
