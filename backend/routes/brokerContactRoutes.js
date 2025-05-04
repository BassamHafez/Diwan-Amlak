const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const brokerContactController = require("../controllers/brokerContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, brokerContactController.getAllBrokerContacts)
  .post(
    authController.checkPermission("ADD_CONTACT"),
    contactValidator.createContactValidator,
    setAccountId,
    brokerContactController.createBrokerContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    brokerContactController.getBrokerContact
  )
  .patch(
    authController.checkPermission("UPDATE_CONTACT"),
    contactValidator.updateContactValidator,
    brokerContactController.updateBrokerContact
  )
  .delete(
    authController.checkPermission("DELETE_CONTACT"),
    contactValidator.getContactValidator,
    brokerContactController.deleteBrokerContact
  );

module.exports = router;
