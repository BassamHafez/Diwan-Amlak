const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema(
  {
    note: String,
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      // مستحقات - عمولة إضافية - السعي - مستحق إضافي - أخرى
      enum: [
        "dues",
        "extra-fee",
        "commission",
        "add-due",
        "settlement",
        "other",
      ],
      default: "dues",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "canceled"],
      default: "pending",
    },
    paidAt: Date,
    paymentMethod: {
      type: String,
      enum: ["cash", "bank-transfer", "online"],
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenantContact",
    },
    estate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
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

revenueSchema.index({ account: 1, dueDate: 1 });

const Revenue = mongoose.model("Revenue", revenueSchema);

module.exports = Revenue;
