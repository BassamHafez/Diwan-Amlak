const mongoose = require("mongoose");

const landlordContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phone2: String,
    notes: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    contactType: {
      type: String,
      enum: ["landlord"],
      default: "landlord",
    },
  },
  { timestamps: true }
);

const LandlordContact = mongoose.model(
  "LandlordContact",
  landlordContactSchema
);

module.exports = LandlordContact;
