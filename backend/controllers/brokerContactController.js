const BrokerContact = require("../models/brokerContactModel");
const factory = require("./handlerFactory");

const brokerFields = "name phone phone2 notes";

exports.getAllBrokerContacts = factory.getAll(BrokerContact, [], brokerFields);
exports.getBrokerContact = factory.getOne(BrokerContact, [], brokerFields);
exports.createBrokerContact = factory.createOne(BrokerContact);
exports.updateBrokerContact = factory.updateOne(BrokerContact);
exports.deleteBrokerContact = factory.deleteOne(BrokerContact);
