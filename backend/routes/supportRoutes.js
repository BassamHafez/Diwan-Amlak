const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const supportController = require("../controllers/supportController");
const supportValidator = require("../utils/validators/supportValidator");

router.post(
  "/messages",
  supportValidator.validateCreateSupportMessage,
  authController.saveTokenAndUserIfExist,
  supportController.createSupportMessage
);

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/messages", supportController.getAllSupportMessages);

router
  .route("/messages/:id")
  .delete(
    supportValidator.validateGetSupportMessage,
    supportController.deleteSupportMessage
  )
  .patch(
    supportValidator.validateUpdateSupportMessageStatus,
    supportController.updateSupportMessageStatus
  );

module.exports = router;
