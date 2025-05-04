const mongoose = require("mongoose");

const brokerContactSchema = new mongoose.Schema(
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
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
    },
    contactType: {
      type: String,
      enum: ["broker"],
      default: "broker",
    },
  },
  { timestamps: true }
);

const BrokerContact = mongoose.model("BrokerContact", brokerContactSchema);

module.exports = BrokerContact;
