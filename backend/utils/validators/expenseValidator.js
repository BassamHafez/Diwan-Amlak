const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createExpenseValidator = [
  check("note")
    .optional()
    .isString()
    .withMessage("Note must be a string")
    .trim(),

  check("amount")
    .exists()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  check("dueDate")
    .exists()
    .withMessage("Due date is required")
    .isDate()
    .withMessage("Due date must be a valid date"),

  check("contact").optional().isMongoId().withMessage("Invalid contact id"),

  check("type")
    .exists()
    .withMessage("Type is required")
    .isIn(["purchases", "maintenance", "other"])
    .withMessage("Invalid type"),

  check("estate")
    .optional()
    .isMongoId()
    .withMessage("Invalid estate id")
    .custom((value, { req }) => {
      if (value && req.body.compound) {
        throw new Error(
          "Expense cannot be associated with both 'estate' and 'compound'"
        );
      }

      return true;
    }),

  check("compound")
    .if((value, { req }) => !req.body.estate)
    .exists()
    .withMessage("Expense must be associated with an 'estate' or 'compound'")
    .isMongoId()
    .withMessage("Invalid compound id"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set"),

  check("status").not().exists().withMessage("Status cannot be set"),

  check("paidAt").not().exists().withMessage("Paid at cannot be set"),

  check("paymentMethod")
    .not()
    .exists()
    .withMessage("Payment method cannot be set"),

  validatorMiddleware,
];

exports.updateExpenseValidator = [
  check("id")
    .exists()
    .withMessage("ID is required")
    .isMongoId()
    .withMessage("Invalid Expense ID"),

  check("note")
    .optional()
    .isString()
    .withMessage("Note must be a string")
    .trim(),

  check("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  check("dueDate")
    .optional()
    .isDate()
    .withMessage("Due date must be a valid date"),

  check("contact").optional().isMongoId().withMessage("Invalid contact id"),

  check("type")
    .optional()
    .isIn(["purchases", "maintenance", "other"])
    .withMessage("Invalid type"),

  // NOT ALLOWED

  check("estate").not().exists().withMessage("Estate cannot be updated"),

  check("compound").not().exists().withMessage("Compound cannot be updated"),

  check("account").not().exists().withMessage("Account cannot be set"),

  check("status").not().exists().withMessage("Status cannot be set"),

  check("paidAt").not().exists().withMessage("Paid at cannot be set"),

  check("paymentMethod")
    .not()
    .exists()
    .withMessage("Payment method cannot be set"),

  validatorMiddleware,
];

exports.getExpenseValidator = [
  check("id")
    .exists()
    .withMessage("ID is required")
    .isMongoId()
    .withMessage("Invalid Expense ID"),

  validatorMiddleware,
];

exports.payExpenseValidator = [
  check("id")
    .exists()
    .withMessage("ID is required")
    .isMongoId()
    .withMessage("Invalid Expense ID"),

  check("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cash", "bank-transfer", "online"])
    .withMessage("Invalid payment method (cash, bank-transfer, online)"),

  check("paidAt")
    .optional()
    .isDate()
    .withMessage("Paid at must be a valid date")
    .customSanitizer((paidAt) => paidAt || new Date().toLocaleDateString()),

  // NOT ALLOWED

  check("status").not().exists().withMessage("Status cannot be set manually"),

  validatorMiddleware,
];
