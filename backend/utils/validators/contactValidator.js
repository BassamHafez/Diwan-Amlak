const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createContactValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("phone2")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim(),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("contactType").isEmpty().withMessage("Contact type cannot be set"),

  validatorMiddleware,
];

exports.updateContactValidator = [
  check("id")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isMongoId()
    .withMessage("Invalid Contact ID"),

  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  check("phone")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("phone2")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim(),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("contactType").isEmpty().withMessage("Contact type cannot be set"),

  validatorMiddleware,
];

exports.getContactValidator = [
  check("id")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isMongoId()
    .withMessage("Invalid Contact ID"),

  validatorMiddleware,
];

// Tenant Contact

exports.createTenantContactValidator = [
  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["individual", "organization"])
    .withMessage("Type must be individual or organization"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("phone2")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("birthDate").optional().isDate().withMessage("Invalid birth date"),

  // check("hijriBirthDate")
  //   .optional()
  //   .isDate()
  //   .withMessage("Invalid Hijri birth date"),

  check("nationalId")
    .optional()
    .notEmpty()
    .withMessage("National ID must be not empty string"),

  check("nationality")
    .optional()
    .notEmpty()
    .withMessage("Nationality must be not empty string"),

  check("email").optional().isEmail().withMessage("Invalid email").trim(),

  check("commercialRecord")
    .optional()
    .isString()
    .withMessage("Commercial record must be a string")
    .matches(/^\d{10}$/)
    .withMessage("Invalid commercial record"),

  check("taxNumber")
    .optional()
    .isString()
    .withMessage("Tax number must be a string")
    .matches(/^\d{15}$/)
    .withMessage("Invalid tax number"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("contactType").isEmpty().withMessage("Contact type cannot be set"),

  validatorMiddleware,
];

exports.updateTenantContactValidator = [
  check("id")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isMongoId()
    .withMessage("Invalid Contact ID"),

  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  check("phone")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("phone2")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("birthDate").optional().isDate().withMessage("Invalid birth date"),

  // check("hijriBirthDate")
  //   .optional()
  //   .isDate()
  //   .withMessage("Invalid Hijri birth date"),

  check("nationalId")
    .optional()
    .notEmpty()
    .withMessage("National ID must be not empty string"),

  check("nationality")
    .optional()
    .notEmpty()
    .withMessage("Nationality must be not empty string"),

  check("address")
    .optional()
    .isString()
    .withMessage("Address must be a string")
    .trim(),

  check("email").optional().isEmail().withMessage("Invalid email").trim(),

  check("commercialRecord")
    .optional()
    .isString()
    .withMessage("Commercial record must be a string")
    .matches(/^\d{10}$/)
    .withMessage("Invalid commercial record"),

  check("taxNumber")
    .optional()
    .isString()
    .withMessage("Tax number must be a string")
    .matches(/^\d{15}$/)
    .withMessage("Invalid tax number"),

  // NOT ALLOWED

  check("account").not().exists().withMessage("Account cannot be set manually"),

  check("type").isEmpty().withMessage("Type cannot be edited"),

  check("contactType").isEmpty().withMessage("Contact type cannot be edited"),

  validatorMiddleware,
];
