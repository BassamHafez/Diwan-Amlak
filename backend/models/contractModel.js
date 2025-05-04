const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    estate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenantContact",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      min: 1,
      required: true,
    },
    paymentPeriodValue: {
      type: Number,
      min: 1,
      required: true,
    },
    paymentPeriodUnit: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "canceled", "upcoming"],
      default: "upcoming",
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    compound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compound",
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandlordContact",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

contractSchema.index({ status: 1 });

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
