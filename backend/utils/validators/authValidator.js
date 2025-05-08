const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isString()
    .withMessage("Invalid user name")
    .isLength({ min: 3 })
    .withMessage("Too short User name"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm !== req.body.password) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  // NOT ALLOWED

  check("role").isEmpty().withMessage("Role cannot be set"),

  check("phoneVerified")
    .isEmpty()
    .withMessage("Phone verification cannot be set"),

  check("passwordResetCode")
    .isEmpty()
    .withMessage("Password reset code cannot be set here"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Incorrect phone or password")
    .isMobilePhone()
    .withMessage("Incorrect phone or password"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Incorrect phone or password"),

  validatorMiddleware,
];

exports.forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  validatorMiddleware,
];

exports.verifyPassResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid reset code or expired"),

  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];
