const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.validateAddTestimonial = [
  check("name").notEmpty().withMessage("Name is required"),

  check("title").notEmpty().withMessage("Title is required"),

  check("comment").notEmpty().withMessage("Comment is required"),

  validatorMiddleware,
];

exports.validateUpdateTestimonial = [
  check("id")
    .exists()
    .withMessage("Testimonial ID is required")
    .isMongoId()
    .withMessage("Invalid Testimonial ID"),

  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a non-empty string")
    .isLength({ min: 1 })
    .withMessage("Name must be a non-empty string"),

  check("title")
    .optional()
    .isString()
    .withMessage("Title must be a non-empty string")
    .isLength({ min: 1 })
    .withMessage("Title must be a non-empty string"),

  check("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a non-empty string")
    .isLength({ min: 1 })
    .withMessage("Comment must be a non-empty string"),

  validatorMiddleware,
];

exports.validateGetTestimonial = [
  check("id")
    .exists()
    .withMessage("Testimonial ID is required")
    .isMongoId()
    .withMessage("Invalid Testimonial ID"),

  validatorMiddleware,
];
