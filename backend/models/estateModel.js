const mongoose = require("mongoose");

const estateSchema = new mongoose.Schema(
  {
    compound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compound",
    },
    unitNumber: Number,
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: String,
    region: String,
    city: String,
    neighborhood: {
      type: String,
      default: "not specified",
    },
    image: {
      type: String,
      default: "/estates/default-estate.png",
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    area: {
      type: Number,
      min: 1,
      required: true,
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
    inFavorites: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },
  },
  { timestamps: true }
);

estateSchema.index({ account: 1 });

const Estate = mongoose.model("Estate", estateSchema);

module.exports = Estate;
