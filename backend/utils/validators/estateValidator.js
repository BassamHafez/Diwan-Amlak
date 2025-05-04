const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createEstateValidator = [
  check("compound").optional().isMongoId().withMessage("Invalid compound ID"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  check("address")
    .optional()
    .trim()
    .isString()
    .withMessage("Address must be a string"),

  check("region")
    .if((value, { req }) => !req.body.compound)
    .notEmpty()
    .withMessage("Region is required")
    .trim()
    .isString()
    .withMessage("Region must be a string"),

  check("city")
    .if((value, { req }) => !req.body.compound)
    .notEmpty()
    .withMessage("City is required")
    .trim()
    .isString()
    .withMessage("City must be a string"),

  check("neighborhood")
    .optional()
    .trim()
    .isString()
    .withMessage("Neighborhood must be a string"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("area")
    .notEmpty()
    .withMessage("Area is required")
    .isNumeric()
    .withMessage("Area must be a number")
    .isInt({ min: 1 })
    .withMessage("Area must be a positive number"),

  check("tags").optional().isArray().withMessage("Tags must be an array"),

  check("tags.*").isString().withMessage("Tags must be strings"),

  check("electricityAccountNumber")
    .optional()
    .isString()
    .withMessage("Electricity account number must be a string of 11 digits")
    .matches(/^\d{11}$/)
    .withMessage("Electricity account number must be a string of 11 digits"),

  check("waterAccountNumber")
    .optional()
    .isString()
    .withMessage("Water account number must be a string of 10 digits")
    .matches(/^\d{10}$/)
    .withMessage("Water account number must be a string of 10 digits"),

  check("broker").optional().isMongoId().withMessage("Invalid broker ID"),

  check("commissionPercentage")
    .if((val, { req }) => req.body.broker)
    .exists()
    .withMessage("Broker commission percentage is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Invalid commission percentage"),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("unitNumber").not().exists().withMessage("Unit number cannot be set"),

  check("inFavorites")
    .isEmpty()
    .withMessage("To add to favorites, use favorites endpoints"),

  check("status").isEmpty().withMessage("Status cannot be set manually"),

  validatorMiddleware,
];

exports.updateEstateValidator = [
  check("id")
    .notEmpty()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid estate ID"),

  check("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  check("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  check("address")
    .optional()
    .trim()
    .isString()
    .withMessage("Address must be a string"),

  check("region")
    .optional()
    .trim()
    .isString()
    .withMessage("Region must be a string"),

  check("city")
    .optional()
    .trim()
    .isString()
    .withMessage("City must be a string"),

  check("neighborhood")
    .optional()
    .trim()
    .isString()
    .withMessage("Neighborhood must be a string"),

  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("area")
    .optional()
    .isNumeric()
    .withMessage("Area must be a number")
    .isInt({ min: 1 })
    .withMessage("Area must be a positive number"),

  check("tags").optional().isArray().withMessage("Tags must be an array"),

  check("tags.*").isString().withMessage("Tags must be strings"),

  check("electricityAccountNumber")
    .optional()
    .isString()
    .withMessage("Electricity account number must be a string of 11 digits")
    .matches(/^\d{11}$/)
    .withMessage("Electricity account number must be a string of 11 digits"),

  check("waterAccountNumber")
    .optional()
    .isString()
    .withMessage("Water account number must be a string of 10 digits")
    .matches(/^\d{10}$/)
    .withMessage("Water account number must be a string of 10 digits"),

  check("broker").optional().isMongoId().withMessage("Invalid broker ID"),

  check("commissionPercentage")
    .if((val, { req }) => req.body.broker)
    .exists()
    .withMessage("Broker commission percentage is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Invalid commission percentage"),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("compound").isEmpty().withMessage("Compound cannot be edited"),

  check("unitNumber").isEmpty().withMessage("Unit number cannot be edited"),

  check("inFavorites")
    .isEmpty()
    .withMessage("To add to favorites, use favorites endpoints"),

  check("status").isEmpty().withMessage("Status cannot be set manually"),

  validatorMiddleware,
];

exports.getEstateValidator = [
  check("id")
    .notEmpty()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid estate ID"),

  validatorMiddleware,
];

// Estate expenses

exports.createEstateExpenseValidator = [
  check("id")
    .exists()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid estate ID"),

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

  check("type")
    .exists()
    .withMessage("Type is required")
    .isIn(["purchases", "maintenance", "other"])
    .withMessage("Invalid type"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set"),

  check("unitNumber").not().exists().withMessage("Unit number cannot be set"),

  check("status").not().exists().withMessage("Status cannot be set"),

  check("paidAt").not().exists().withMessage("Paid at cannot be set"),

  check("paymentMethod")
    .not()
    .exists()
    .withMessage("Payment method cannot be set"),

  check("estate")
    .not()
    .exists()
    .withMessage("Estate cannot be set manually in compound expense"),

  check("compound")
    .not()
    .exists()
    .withMessage("Compound cannot be set manually in compound expense"),

  validatorMiddleware,
];
