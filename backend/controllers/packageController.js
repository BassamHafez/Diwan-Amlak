const Package = require("../models/packageModel");
const factory = require("./handlerFactory");

exports.getAllPackages = factory.getAll(Package);
exports.createPackage = factory.createOne(Package);
exports.updatePackage = factory.updateOne(Package);
exports.deletePackage = factory.deleteOne(Package);
