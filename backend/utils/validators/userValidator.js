const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.updateMeValidator = [
  check("name").optional().isString().withMessage("Name must be a string"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email"),

  check("phone")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

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

exports.updatePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isString()
    .withMessage("Current password must be a string"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required")
    .isString()
    .withMessage("Password confirm must be a string")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.verifyPhoneValidator = [
  check("verificationCode")
    .notEmpty()
    .withMessage("Verification code is required")
    .isString()
    .withMessage("Verification code must be a string"),

  validatorMiddleware,
];

exports.addAdminValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
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

  validatorMiddleware,
];

exports.validateSendUsersMessage = [
  check("message")
    .isString()
    .withMessage("Message must be a string")
    .notEmpty()
    .withMessage("Message is required"),

  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["whatsapp", "email"])
    .withMessage("Type must be either 'whatsapp' or 'email'"),

  check("emailSubject")
    .if((value, { req }) => req.body.type === "email")
    .exists()
    .withMessage("Email subject is required")
    .notEmpty()
    .withMessage("Email subject is required"),

  check("usersIds")
    .exists()
    .withMessage("Users IDs are required")
    .isArray({ min: 1 })
    .withMessage("Users IDs must be an array with at least one ID"),

  check("usersIds.*").isMongoId().withMessage("Invalid user ID in users IDs"),

  validatorMiddleware,
];
