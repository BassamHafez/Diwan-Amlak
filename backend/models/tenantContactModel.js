const mongoose = require("mongoose");

const tenantContactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["individual", "organization"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phone2: String,
    birthDate: Date,
    // hijriBirthDate: Date,
    notes: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    nationalId: String,
    nationality: String,
    address: String,
    email: String,
    commercialRecord: String,
    taxNumber: String,
    contactType: {
      type: String,
      enum: ["tenant"],
      default: "tenant",
    },
  },
  { timestamps: true }
);

const TenantContact = mongoose.model("TenantContact", tenantContactSchema);

module.exports = TenantContact;
