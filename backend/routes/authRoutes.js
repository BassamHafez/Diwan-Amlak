const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authValidator = require("../utils/validators/authValidator");

router.post("/signup", authValidator.signupValidator, authController.signup);
router.post("/login", authValidator.loginValidator, authController.login);
router.post(
  "/forgotPassword",
  authValidator.forgotPasswordValidator,
  authController.forgotPassword
);
router.post(
  "/verifyResetCode",
  authValidator.verifyPassResetCodeValidator,
  authController.verifyPassResetCode
);
router.put(
  "/resetPassword",
  authValidator.resetPasswordValidator,
  authController.resetPassword
);

module.exports = router;
