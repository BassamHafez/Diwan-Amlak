const Account = require("../models/accountModel");
const BrokerContact = require("../models/brokerContactModel");
const ServiceContact = require("../models/serviceContactModel");
const LandlordContact = require("../models/landlordContactModel");
const TenantContact = require("../models/tenantContactModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;

  const account = await Account.findById(accountId)
    .select("isVIP isServiceContactsAllowed ")
    .lean();

  if (!account) {
    return next(new AppError("Account not found", 404));
  }

  const collections = [BrokerContact, LandlordContact, TenantContact];

  if (!account.isVIP && account.isServiceContactsAllowed) {
    collections.push(ServiceContact);
  }

  const contactPromises = collections.map((collection) =>
    collection.find({ account: accountId }).lean()
  );

  const contacts = await Promise.all(contactPromises);

  const allContacts = contacts.flat();

  res.status(200).json({
    status: "success",
    data: allContacts,
  });
});
