const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createTaskValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  check("date")
    .exists()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Date must be a valid date"),

  check("estate")
    .optional()
    .isMongoId()
    .withMessage("Invalid estate id")
    .custom((value, { req }) => {
      if (value && req.body.compound) {
        throw new Error("Only one of 'estate' or 'compound' can be set");
      }

      return true;
    }),

  check("compound").optional().isMongoId().withMessage("Invalid compound id"),

  check("contact").optional().isMongoId().withMessage("Invalid contact id"),

  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type must be a string")
    .isIn(["purchases", "maintenance", "reminder", "other"])
    .withMessage("Invalid type"),

  check("cost")
    .exists()
    .withMessage("Cost is required")
    .isFloat({ min: 0 })
    .withMessage("Cost must be a positive number"),

  check("priority")
    .isString()
    .withMessage("Priority must be a string")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("isCompleted")
    .not()
    .exists()
    .withMessage("isCompleted cannot be set manually"),

  check("completedAt")
    .not()
    .exists()
    .withMessage("completedAt cannot be set manually"),

  validatorMiddleware,
];

exports.updateTaskValidator = [
  check("id")
    .exists()
    .withMessage("Task id is required")
    .isMongoId()
    .withMessage("Invalid task id"),

  check("title").optional().isString().withMessage("Title must be a string"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  check("date").optional().isDate().withMessage("Date must be a valid date"),

  check("estate")
    .optional()
    .isMongoId()
    .withMessage("Invalid estate id")
    .custom((value, { req }) => {
      if (value && req.body.compound) {
        throw new Error("Only one of 'estate' or 'compound' can be set");
      }

      return true;
    }),

  check("compound").optional().isMongoId().withMessage("Invalid compound id"),

  check("contact").optional().isMongoId().withMessage("Invalid contact id"),

  check("type")
    .optional()
    .isString()
    .withMessage("Type must be a string")
    .isIn(["purchases", "maintenance", "reminder", "other"])
    .withMessage("Invalid type"),

  check("cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost must be a positive number"),

  check("priority")
    .optional()
    .isString()
    .withMessage("Priority must be a string")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("isCompleted")
    .not()
    .exists()
    .withMessage("isCompleted cannot be set manually"),

  check("completedAt")
    .not()
    .exists()
    .withMessage("completedAt cannot be set manually"),

  validatorMiddleware,
];

exports.getTaskValidator = [
  check("id")
    .exists()
    .withMessage("Task id is required")
    .isMongoId()
    .withMessage("Invalid task id"),

  validatorMiddleware,
];

exports.completeTaskValidator = [
  check("id")
    .exists()
    .withMessage("Task id is required")
    .isMongoId()
    .withMessage("Invalid task id"),

  check("isCompleted")
    .exists()
    .withMessage("isCompleted is required")
    .isBoolean()
    .withMessage("isCompleted must be a boolean"),

  validatorMiddleware,
];
