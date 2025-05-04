const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account must have an owner"],
    },
    name: String,
    phone: String,
    address: String,
    region: String,
    city: String,
    commercialRecord: String,
    taxNumber: String,
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        tag: {
          type: String,
          default: "member",
        },
        permissions: {
          type: [String],
          default: [],
        },
        permittedCompounds: {
          type: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Compound",
            },
          ],
          default: [],
        },
      },
    ],
    subscriptionEndDate: {
      type: Date,
      default: new Date(),
    },
    isVIP: {
      type: Boolean,
      default: false,
    },
    allowedUsers: {
      type: Number,
      default: 0,
    },
    allowedCompounds: {
      type: Number,
      default: 1,
    },
    allowedEstates: {
      type: Number,
      default: 5,
    },
    maxEstatesInCompound: {
      type: Number,
      default: 3,
    },
    isFavoriteAllowed: {
      type: Boolean,
      default: false,
    },
    isRemindersAllowed: {
      type: Boolean,
      default: false,
    },
    isAnalysisAllowed: {
      type: Boolean,
      default: false,
    },
    isFinancialReportsAllowed: {
      type: Boolean,
      default: false,
    },
    isOperationalReportsAllowed: {
      type: Boolean,
      default: false,
    },
    isCompoundsReportsAllowed: {
      type: Boolean,
      default: false,
    },
    isTasksAllowed: {
      type: Boolean,
      default: false,
    },
    isFilesExtractAllowed: {
      type: Boolean,
      default: false,
    },
    isServiceContactsAllowed: {
      type: Boolean,
      default: false,
    },
    isUserPermissionsAllowed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
