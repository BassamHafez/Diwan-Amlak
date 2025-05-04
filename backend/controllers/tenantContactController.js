const TenantContact = require("../models/tenantContactModel");
const factory = require("./handlerFactory");

const tenantFields =
  "type name phone phone2 notes birthDate nationalId nationality address email commercialRecord taxNumber";

exports.getAllTenantContacts = factory.getAll(TenantContact, [], tenantFields);
exports.getTenantContact = factory.getOne(TenantContact, [], tenantFields);
exports.createTenantContact = factory.createOne(TenantContact);
exports.updateTenantContact = factory.updateOne(TenantContact);
exports.deleteTenantContact = factory.deleteOne(TenantContact);
