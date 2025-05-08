const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const tenantContactController = require("../controllers/tenantContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, tenantContactController.getAllTenantContacts)
  .post(
    authController.checkPermission("ADD_CONTACT"),
    contactValidator.createTenantContactValidator,
    setAccountId,
    tenantContactController.createTenantContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    tenantContactController.getTenantContact
  )
  .patch(
    authController.checkPermission("UPDATE_CONTACT"),
    contactValidator.updateTenantContactValidator,
    tenantContactController.updateTenantContact
  )
  .delete(
    authController.checkPermission("DELETE_CONTACT"),
    contactValidator.getContactValidator,
    tenantContactController.deleteTenantContact
  );

module.exports = router;
