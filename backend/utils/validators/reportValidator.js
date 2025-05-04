const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.validateIncomeReport = [
  check("startDate")
    .exists()
    .withMessage("Start date is required")
    .isDate()
    .withMessage("Start date must be a valid date")
    .custom((startDate, { req }) => {
      if (startDate >= req.body.endDate) {
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
      if (endDate <= req.body.startDate) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  check("estate")
    .optional()
    .isMongoId()
    .withMessage("Invalid estate id")
    .custom((value, { req }) => {
      if (value && req.body.compound) {
        throw new Error("Select either estate or compound");
      }

      return true;
    }),

  check("compound").optional().isMongoId().withMessage("Invalid compound id"),

  validatorMiddleware,
];

exports.validatePaymentsReport = [
  check("startDueDate")
    .exists()
    .withMessage("Start dueDate is required")
    .isDate()
    .withMessage("Start dueDate must be a valid date")
    .custom((startDate, { req }) => {
      if (startDate >= req.body.endDate) {
        throw new Error("Start dueDate must be before end dueDate");
      }

      return true;
    }),

  check("endDueDate")
    .exists()
    .withMessage("End dueDate is required")
    .isDate()
    .withMessage("End dueDate must be a valid date")
    .custom((endDate, { req }) => {
      if (endDate <= req.body.startDate) {
        throw new Error("End dueDate must be after start dueDate");
      }

      return true;
    }),

  check("status")
    .optional()
    .isIn(["paid", "pending"])
    .withMessage("Invalid status"),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  check("estate")
    .optional()
    .isMongoId()
    .withMessage("Invalid estate id")
    .custom((value, { req }) => {
      if (value && req.body.compound) {
        throw new Error("Select either estate or compound");
      }

      return true;
    }),

  check("compound").optional().isMongoId().withMessage("Invalid compound id"),

  validatorMiddleware,
];

exports.validateContractsReport = [
  check("startDueDate")
    .exists()
    .withMessage("Start dueDate is required")
    .isDate()
    .withMessage("Start dueDate must be a valid date")
    .custom((startDate, { req }) => {
      if (startDate >= req.body.endDate) {
        throw new Error("Start dueDate must be before end dueDate");
      }

      return true;
    }),

  check("endDueDate")
    .exists()
    .withMessage("End dueDate is required")
    .isDate()
    .withMessage("End dueDate must be a valid date")
    .custom((endDate, { req }) => {
      if (endDate <= req.body.startDate) {
        throw new Error("End dueDate must be after start dueDate");
      }

      return true;
    }),

  check("status")
    .optional()
    .isIn(["active", "completed", "canceled", "upcoming"])
    .withMessage("Invalid status"),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  check("estate")
    .optional()
    .isMongoId()
    .withMessage("Invalid estate id")
    .custom((value, { req }) => {
      if (value && req.body.compound) {
        throw new Error("Select either estate or compound");
      }

      return true;
    }),

  check("compound").optional().isMongoId().withMessage("Invalid compound id"),

  validatorMiddleware,
];

exports.validateCompoundsReport = [
  check("startDate")
    .exists()
    .withMessage("Start date is required")
    .isDate()
    .withMessage("Start date must be a valid date"),

  check("endDate")
    .exists()
    .withMessage("End date is required")
    .isDate()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (endDate <= req.body.startDate) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),

  check("compoundsIds")
    .exists()
    .withMessage("Compounds ids are required")
    .isArray()
    .withMessage("Compounds ids must be an array"),

  check("compoundsIds.*").isMongoId().withMessage("Invalid compound id"),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  validatorMiddleware,
];

exports.validateCompoundDetailsReport = [
  check("startDate")
    .exists()
    .withMessage("Start date is required")
    .isDate()
    .withMessage("Start date must be a valid date"),

  check("endDate")
    .exists()
    .withMessage("End date is required")
    .isDate()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (endDate <= req.body.startDate) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),

  check("compoundId")
    .exists()
    .withMessage("Compound ID is required")
    .isMongoId()
    .withMessage("Invalid compound ID"),

  validatorMiddleware,
];
