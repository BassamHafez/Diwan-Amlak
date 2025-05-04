const Account = require("../models/accountModel");
const ServiceContact = require("../models/serviceContactModel");
const factory = require("./handlerFactory");
const ApiError = require("../utils/ApiError");

exports.checkContactsPermission = async (req, res, next) => {
  if (req.user && req.user.account) {
    const account = await Account.findById(req.user.account)
      .select("isServiceContactsAllowed isVIP")
      .lean();

    if (!account || !account.isServiceContactsAllowed || !account.isVIP) {
      return next(
        new ApiError("Your Subscription does not allow this feature", 403)
      );
    }
  }
  next();
};

const serviceFields = "name phone phone2 notes";

exports.getAllServiceContacts = factory.getAll(
  ServiceContact,
  [],
  serviceFields
);
exports.getServiceContact = factory.getOne(ServiceContact, [], serviceFields);
exports.createServiceContact = factory.createOne(ServiceContact);
exports.updateServiceContact = factory.updateOne(ServiceContact);
exports.deleteServiceContact = factory.deleteOne(ServiceContact);
