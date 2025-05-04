const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createContractValidator = [
  check("estateId")
    .exists()
    .withMessage("estateId param is required")
    .isMongoId()
    .withMessage("Invalid estateId param"),

  check("tenant")
    .exists()
    .withMessage("Tenant is required")
    .isMongoId()
    .withMessage("Tenant must be a valid ID"),

  check("startDate")
    .exists()
    .withMessage("Start date is required")
    .isDate()
    .withMessage("Start date must be a valid date")
    .custom((startDate, { req }) => {
      if (new Date(startDate) >= new Date(req.body.endDate)) {
        throw new Error("Start date must be before end date");
      }

      return true;
    }),

  check("endDate")
    .exists()
    .withMessage("End date is required")
    .isDate()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date().setHours(23, 59, 59, 999)) {
        throw new Error("End date must be a future date");
      }

      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),

  check("totalAmount")
    .exists()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),

  check("paymentPeriodValue")
    .exists()
    .withMessage("Payment period value is required")
    .isInt({ min: 1 })
    .withMessage("Payment period value must be a positive integer"),

  check("paymentPeriodUnit")
    .notEmpty()
    .withMessage("Payment period unit is required")
    .isIn(["day", "week", "month", "year"])
    .withMessage("Payment period unit must be one of: day, week, month, year"),

  // NOT ALLOWED

  check("status").not().exists().withMessage("Status cannot be set manually"),

  check("account").not().exists().withMessage("Account cannot be set manually"),

  validatorMiddleware,
];

exports.getContractsValidator = [
  check("estateId")
    .exists()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid Estate ID"),

  validatorMiddleware,
];

exports.getContractValidator = [
  check("estateId")
    .exists()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid Estate ID"),

  check("id")
    .exists()
    .withMessage("Contract ID is required")
    .isMongoId()
    .withMessage("Invalid Contract ID"),

  validatorMiddleware,
];

exports.updateContractValidator = [
  check("estateId")
    .exists()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid Estate ID"),

  check("id")
    .exists()
    .withMessage("Contract ID is required")
    .isMongoId()
    .withMessage("Invalid Contract ID"),

  check("startDate")
    .exists()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date in the format YYYY-MM-DD")
    .custom((startDate, { req }) => {
      if (startDate < Date.now()) {
        throw new Error("Start date must be a future date");
      }

      if (startDate > req.body.endDate) {
        throw new Error("Start date must be before end date");
      }

      return true;
    }),

  check("endDate")
    .exists()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date in the format YYYY-MM-DD")
    .custom((endDate, { req }) => {
      if (endDate < Date.now()) {
        throw new Error("End date must be a future date");
      }

      if (endDate < req.body.startDate) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),

  check("totalAmount")
    .exists()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),

  check("paymentPeriodValue")
    .exists()
    .withMessage("Payment period value is required")
    .isInt({ min: 1 })
    .withMessage("Payment period value must be a positive integer"),

  check("paymentPeriodUnit")
    .notEmpty()
    .withMessage("Payment period unit is required")
    .isIn(["day", "week", "month", "year"])
    .withMessage("Payment period unit must be one of: day, week, month, year"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("estate").not().exists().withMessage("Estate cannot be set manually"),

  check("tenant").not().exists().withMessage("Tenant cannot be edited"),

  validatorMiddleware,
];

exports.extendContractValidator = [
  check("estateId")
    .exists()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid Estate ID"),

  check("id")
    .exists()
    .withMessage("Contract ID is required")
    .isMongoId()
    .withMessage("Invalid Contract ID"),

  check("endDate")
    .exists()
    .withMessage("End date is required")
    .isDate()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date().setHours(23, 59, 59, 999)) {
        throw new Error("End date must be a future date");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.settleContractValidator = [
  check("estateId")
    .exists()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid Estate ID"),

  check("id")
    .exists()
    .withMessage("Contract ID is required")
    .isMongoId()
    .withMessage("Invalid Contract ID"),

  check("settlementAmount")
    .exists()
    .withMessage("Settlement amount is required")
    .isFloat({ min: 0 })
    .withMessage("Settlement amount must be a positive number"),

  check("paymentMethod")
    .exists()
    .withMessage("Payment method is required")
    .isIn(["cash", "bank-transfer", "online"])
    .withMessage("Payment method must be one of: cash, bank-transfer, online"),

  validatorMiddleware,
];
