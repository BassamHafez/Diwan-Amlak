const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");
const { USER_ACCESS_PERMISSIONS } = require("../globals");

exports.getAccountValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  validatorMiddleware,
];

exports.subscribeValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("usersCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Invalid users count"),

  check("compoundsCount")
    .exists()
    .withMessage("Compounds count is required")
    .isInt({ min: 0 })
    .withMessage("Invalid compounds count"),

  check("estatesCount")
    .exists()
    .withMessage("Estate count is required")
    .isInt({ min: 0 })
    .withMessage("Invalid estate count"),

  check("maxEstatesInCompound")
    .exists()
    .withMessage("Max estates in compound is required")
    .isInt({ min: 0 })
    .withMessage("Invalid max estates in compound")
    .isIn([0, 3, 10, 30, 50, 300])
    .withMessage("Invalid max estates in compound"),

  check("isFavoriteAllowed")
    .exists()
    .withMessage("Favorite allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isRemindersAllowed")
    .exists()
    .withMessage("Reminders allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isAnalysisAllowed")
    .exists()
    .withMessage("Analysis allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isFinancialReportsAllowed")
    .exists()
    .withMessage("Financial Reports allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isOperationalReportsAllowed")
    .exists()
    .withMessage("Operational Reports allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isCompoundsReportsAllowed")
    .exists()
    .withMessage("Compounds Reports allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isTasksAllowed")
    .exists()
    .withMessage("Tasks allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isFilesExtractAllowed")
    .exists()
    .withMessage("Files Extract allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isServiceContactsAllowed")
    .exists()
    .withMessage("Contacts allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  check("isUserPermissionsAllowed")
    .exists()
    .withMessage("User Permissions allowed is required")
    .isBoolean()
    .withMessage("Invalid boolean value"),

  validatorMiddleware,
];

exports.subscribeInPackageValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("packageId")
    .exists()
    .withMessage("Package ID is required")
    .isMongoId()
    .withMessage("Invalid package ID"),

  validatorMiddleware,
];

exports.updateAccountValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),

  check("region")
    .notEmpty()
    .withMessage("Region is required")
    .isString()
    .withMessage("Region must be a string"),

  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

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

  check("owner").not().exists().withMessage("Owner is not allowed"),

  check("members").not().exists().withMessage("Members are not allowed"),

  check("allowedUsers")
    .not()
    .exists()
    .withMessage("Allowed users are not allowed"),

  check("allowedCompounds")
    .not()
    .exists()
    .withMessage("Allowed compounds are not allowed"),

  check("allowedEstates")
    .not()
    .exists()
    .withMessage("Allowed estates are not allowed"),

  check("maxEstatesInCompound")
    .not()
    .exists()
    .withMessage("Max estates in compound is not allowed"),

  check("isFavoriteAllowed")
    .not()
    .exists()
    .withMessage("Favorite allowed is not allowed"),

  check("isRemindersAllowed")
    .not()
    .exists()
    .withMessage("Reminders allowed is not allowed"),

  check("isAnalysisAllowed")
    .not()
    .exists()
    .withMessage("Analysis allowed is not allowed"),

  check("isFinancialReportsAllowed")
    .not()
    .exists()
    .withMessage("Financial Reports allowed is not allowed"),

  check("isOperationalReportsAllowed")
    .not()
    .exists()
    .withMessage("Operational Reports allowed is not allowed"),

  check("isCompoundsReportsAllowed")
    .not()
    .exists()
    .withMessage("Compounds Reports allowed is not allowed"),

  check("isTasksAllowed")
    .not()
    .exists()
    .withMessage("Tasks allowed is not allowed"),

  check("isFilesExtractAllowed")
    .not()
    .exists()
    .withMessage("Files Extract allowed is not allowed"),

  check("isServiceContactsAllowed")
    .not()
    .exists()
    .withMessage("Contacts allowed is not allowed"),

  check("isUserPermissionsAllowed")
    .not()
    .exists()
    .withMessage("User Permissions allowed is not allowed"),

  validatorMiddleware,
];

exports.addMemberValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("tag").notEmpty().withMessage("Tag required"),

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

  check("permittedCompounds")
    .exists()
    .withMessage("Permitted compounds required")
    .isArray()
    .withMessage("Permitted compounds must be an array"),

  check("permittedCompounds.*").isMongoId().withMessage("Invalid compound ID"),

  check("permissions")
    .exists()
    .withMessage("Permissions required")
    .isArray()
    .withMessage("Permissions must be an array"),

  check("permissions.*")
    .isString()
    .withMessage("Permission must be a string")
    .notEmpty()
    .withMessage("Permission cannot be empty")
    .isIn(USER_ACCESS_PERMISSIONS)
    .withMessage((value) => `Invalid permission: ${value}`),

  validatorMiddleware,
];

exports.updateMemberValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("userId")
    .exists()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  check("tag").optional().notEmpty().withMessage("Tag must not be empty"),

  check("permittedCompounds")
    .optional()
    .isArray()
    .withMessage("Permitted compounds must be an array"),

  check("permittedCompounds.*").isMongoId().withMessage("Invalid compound ID"),

  check("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array"),

  check("permissions.*")
    .isString()
    .withMessage("Permission must be a string")
    .notEmpty()
    .withMessage("Permission cannot be empty")
    .isIn(USER_ACCESS_PERMISSIONS)
    .withMessage((value) => `Invalid permission: ${value}`),

  validatorMiddleware,
];

exports.deleteMemberValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("userId")
    .exists()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  validatorMiddleware,
];

exports.validateAddVIP = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Invalid price")
    .isFloat({ min: 0 })
    .withMessage("Invalid price"),

  check("months")
    .exists()
    .withMessage("Months are required")
    .isInt({ min: 1 })
    .withMessage("Invalid months"),

  validatorMiddleware,
];
