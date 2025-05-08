const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.getRevenuesValidator = [
  check("estateId")
    .exists()
    .withMessage("estateId param is required")
    .isMongoId()
    .withMessage("Invalid estateId param"),

  validatorMiddleware,
];

exports.createRevenueValidator = [
  check("estateId")
    .exists()
    .withMessage("estateId param is required")
    .isMongoId()
    .withMessage("Invalid estateId param"),

  check("amount")
    .exists()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  check("dueDate")
    .exists()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date in the format YYYY-MM-DD")
    .custom((dueDate) => {
      if (dueDate < Date.now()) {
        throw new Error("Due date must be a future date");
      }

      return true;
    }),

  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["extra-fee", "commission", "add-due", "other"])
    .withMessage("Invalid type (extra-fee, commission, add-due, other)"),

  check("tenant")
    .optional()
    .isMongoId()
    .withMessage("Tenant must be a valid ID"),

  // NOT ALLOWED

  check("status").not().exists().withMessage("Status cannot be set manually"),

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("paymentMethod")
    .not()
    .exists()
    .withMessage("Payment method cannot be set manually"),

  validatorMiddleware,
];

exports.getRevenueValidator = [
  check("estateId")
    .exists()
    .withMessage("estateId param is required")
    .isMongoId()
    .withMessage("Invalid estateId param"),

  check("id")
    .exists()
    .withMessage("Revenue ID is required")
    .isMongoId()
    .withMessage("Invalid Revenue ID"),

  validatorMiddleware,
];

exports.payRevenueValidator = [
  check("estateId")
    .exists()
    .withMessage("estateId param is required")
    .isMongoId()
    .withMessage("Invalid estateId param"),

  check("id")
    .exists()
    .withMessage("Revenue ID is required")
    .isMongoId()
    .withMessage("Invalid Revenue ID"),

  check("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cash", "bank-transfer", "online"])
    .withMessage("Invalid payment method (cash, bank-transfer, online)"),

  check("paidAt")
    .optional()
    .isISO8601()
    .withMessage("Paid at must be a valid date in the format YYYY-MM-DD")
    .customSanitizer((paidAt) => paidAt || Date.now()),

  // NOT ALLOWED

  check("status").not().exists().withMessage("Status cannot be set manually"),

  validatorMiddleware,
];

exports.splitRevenueValidator = [
  check("estateId")
    .exists()
    .withMessage("estateId param is required")
    .isMongoId()
    .withMessage("Invalid estateId param"),

  check("id")
    .exists()
    .withMessage("Revenue ID is required")
    .isMongoId()
    .withMessage("Invalid Revenue ID"),

  check("splitedAmount")
    .exists()
    .withMessage("Splited amount is required")
    .isFloat({ min: 0 })
    .withMessage("Splited amount must be a positive number"),

  check("dueDate")
    .exists()
    .withMessage("Due date is required")
    .isDate()
    .withMessage("Due date must be a valid date"),

  check("note").optional().notEmpty().withMessage("Note must be a string"),

  validatorMiddleware,
];
