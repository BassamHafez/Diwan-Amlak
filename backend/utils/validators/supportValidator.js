const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.validateCreateSupportMessage = [
  check("name").notEmpty().withMessage("Name is required"),

  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phone").optional().isMobilePhone().withMessage("Invalid phone number"),

  check("subject").notEmpty().withMessage("Subject is required"),

  check("message").notEmpty().withMessage("Message is required"),

  // NOT ALLOWED

  check("status").not().exists().withMessage("Status is not allowed"),

  check("user").not().exists().withMessage("User is not allowed"),

  validatorMiddleware,
];

exports.validateGetSupportMessage = [
  check("id")
    .exists()
    .withMessage("Message ID is required")
    .isMongoId()
    .withMessage("Invalid message ID"),

  validatorMiddleware,
];

exports.validateUpdateSupportMessageStatus = [
  check("id")
    .exists()
    .withMessage("Message ID is required")
    .isMongoId()
    .withMessage("Invalid message ID"),

  check("status")
    .exists()
    .withMessage("Status is required")
    .isIn(["pending", "processing", "completed", "archived"])
    .withMessage("Invalid status"),

  validatorMiddleware,
];
