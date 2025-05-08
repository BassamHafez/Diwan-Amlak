const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  type: {
    type: String,
    enum: ["vip", "package", "custom"],
    required: true,
  },
  vipMonths: {
    type: Number,
    min: 0,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
  customPackage: Object,
  accountData: Object,
  date: {
    type: Date,
    default: Date.now,
  },
  telrRef: String,
  paymentInfo: Object,
  billInfo: Object,
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
