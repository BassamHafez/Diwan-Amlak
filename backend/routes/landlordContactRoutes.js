const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const landlordContactController = require("../controllers/landlordContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, landlordContactController.getAllLandlordContacts)
  .post(
    authController.checkPermission("ADD_CONTACT"),
    contactValidator.createContactValidator,
    setAccountId,
    landlordContactController.createLandlordContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    landlordContactController.getLandlordContact
  )
  .patch(
    authController.checkPermission("UPDATE_CONTACT"),
    contactValidator.updateContactValidator,
    landlordContactController.updateLandlordContact
  )
  .delete(
    authController.checkPermission("DELETE_CONTACT"),
    contactValidator.getContactValidator,
    landlordContactController.deleteLandlordContact
  );

module.exports = router;
