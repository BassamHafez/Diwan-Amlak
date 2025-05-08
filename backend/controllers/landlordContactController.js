const LandlordContact = require("../models/landlordContactModel");
const factory = require("./handlerFactory");

const landlordFields = "name phone phone2 notes";

exports.getAllLandlordContacts = factory.getAll(
  LandlordContact,
  [],
  landlordFields
);
exports.getLandlordContact = factory.getOne(
  LandlordContact,
  [],
  landlordFields
);
exports.createLandlordContact = factory.createOne(LandlordContact);
exports.updateLandlordContact = factory.updateOne(LandlordContact);
exports.deleteLandlordContact = factory.deleteOne(LandlordContact);
