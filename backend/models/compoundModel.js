const mongoose = require("mongoose");

const compoundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: String,
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      default: "not specified",
    },
    image: {
      type: String,
      default: "/compounds/default-compound.png",
    },
    tags: [String],
    electricityAccountNumber: {
      type: String,
      // match: /^\d{11}$/, // 11 digits
    },
    waterAccountNumber: {
      type: String,
      // match: /^\d{10}$/, // 10 digits
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrokerContact",
    },
    commissionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandlordContact",
    },
    estatesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

compoundSchema.index({ account: 1 });

const Compound = mongoose.model("Compound", compoundSchema);

module.exports = Compound;
