const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createPackageValidator = [
  check("arTitle")
    .notEmpty()
    .withMessage("arTitle is required")
    .isString()
    .withMessage("arTitle must be a string"),

  check("enTitle")
    .notEmpty()
    .withMessage("enTitle is required")
    .isString()
    .withMessage("enTitle must be a string"),

  check("price")
    .exists()
    .withMessage("price is required")
    .isFloat({ min: 0 })
    .withMessage("price must be a number greater than or equal to 0"),

  check("originalPrice")
    .exists()
    .withMessage("originalPrice is required")
    .isFloat({ min: 0 })
    .withMessage("originalPrice must be a number greater than or equal to 0"),

  check("isBestOffer")
    .optional()
    .isBoolean()
    .withMessage("isBestOffer must be a boolean"),

  check("isMostPopular")
    .optional()
    .isBoolean()
    .withMessage("isMostPopular must be a boolean"),

  check("duration")
    .exists()
    .withMessage("duration is required")
    .isInt({ min: 1 })
    .withMessage("duration must be a positive integer"),

  check("features")
    .exists()
    .withMessage("features is required")
    .isArray({ min: 1 })
    .withMessage("features must be an array with at least one element"),

  check("features.*.label")
    .notEmpty()
    .withMessage("label is required")
    .isString()
    .withMessage("label must be a string")
    .isIn([
      "allowedUsers",
      "allowedCompounds",
      "allowedEstates",
      "maxEstatesInCompound",
      "isFavoriteAllowed",
      "isRemindersAllowed",
      "isAnalysisAllowed",
      "isFinancialReportsAllowed",
      "isOperationalReportsAllowed",
      "isCompoundsReportsAllowed",
      "isTasksAllowed",
      "isFilesExtractAllowed",
      "isServiceContactsAllowed",
      "isUserPermissionsAllowed",
    ])
    .withMessage((value) => `Invalid label: ${value}`),

  check("features.*.value")
    .notEmpty()
    .withMessage("value is required")
    .isString()
    .withMessage("value must be a string"),

  validatorMiddleware,
];

exports.updatePackageValidator = [
  check("id")
    .notEmpty()
    .withMessage("Package id is required")
    .isMongoId()
    .withMessage("Invalid package id"),

  check("arTitle")
    .optional()
    .isString()
    .withMessage("arTitle must be a string"),

  check("enTitle")
    .optional()
    .isString()
    .withMessage("enTitle must be a string"),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("price must be a number greater than or equal to 0"),

  check("originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("originalPrice must be a number greater than or equal to 0"),

  check("isBestOffer")
    .optional()
    .isBoolean()
    .withMessage("isBestOffer must be a boolean"),

  check("isMostPopular")
    .optional()
    .isBoolean()
    .withMessage("isMostPopular must be a boolean"),

  check("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("duration must be a positive integer"),

  check("features")
    .optional()
    .isArray({ min: 1 })
    .withMessage("features must be an array with at least one element"),

  check("features.*.label")
    .optional()
    .isString()
    .withMessage("label must be a string")
    .isIn([
      "allowedUsers",
      "allowedCompounds",
      "allowedEstates",
      "maxEstatesInCompound",
      "isFavoriteAllowed",
      "isRemindersAllowed",
      "isAnalysisAllowed",
      "isFinancialReportsAllowed",
      "isOperationalReportsAllowed",
      "isCompoundsReportsAllowed",
      "isTasksAllowed",
      "isFilesExtractAllowed",
      "isServiceContactsAllowed",
      "isUserPermissionsAllowed",
    ])
    .withMessage((value) => `Invalid label: ${value}`),

  check("features.*.value")
    .optional()
    .isString()
    .withMessage("value must be a string"),

  validatorMiddleware,
];

exports.deletePackageValidator = [
  check("id")
    .notEmpty()
    .withMessage("Package id is required")
    .isMongoId()
    .withMessage("Invalid package id"),

  validatorMiddleware,
];
