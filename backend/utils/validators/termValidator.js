const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.validateUpdateTerms = [
  check("ar")
    .exists()
    .withMessage("Arabic terms are required")
    .isArray({ min: 1 })
    .withMessage("Arabic terms should be an array with at least one element"),

  check("ar.*")
    .notEmpty()
    .withMessage("each term in Arabic terms must be not empty string"),

  check("en")
    .exists()
    .withMessage("English terms are required")
    .isArray({ min: 1 })
    .withMessage("English terms should be an array with at least one element"),

  check("en.*")
    .notEmpty()
    .withMessage("each term in English terms must be not empty string"),

  validatorMiddleware,
];
