const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const serviceContactController = require("../controllers/serviceContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(
  authController.protect,
  serviceContactController.checkContactsPermission
);

router
  .route("/")
  .get(filterAccountResults, serviceContactController.getAllServiceContacts)
  .post(
    authController.checkPermission("ADD_CONTACT"),
    contactValidator.createContactValidator,
    setAccountId,
    serviceContactController.createServiceContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    serviceContactController.getServiceContact
  )
  .patch(
    authController.checkPermission("UPDATE_CONTACT"),
    contactValidator.updateContactValidator,
    serviceContactController.updateServiceContact
  )
  .delete(
    authController.checkPermission("DELETE_CONTACT"),
    contactValidator.getContactValidator,
    serviceContactController.deleteServiceContact
  );

module.exports = router;
