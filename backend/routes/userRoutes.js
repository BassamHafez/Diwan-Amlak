const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const userValidator = require("../utils/validators/userValidator");

router.use(authController.protect);

router
  .route("/me")
  .get(userController.getMe, userController.getUser)
  .patch(
    userValidator.updateMeValidator,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  )
  .delete(userController.deleteMe);

router.patch(
  "/me/password",
  userValidator.updatePasswordValidator,
  userController.updatePassword
);

router.get("/phone-wa-code", userController.getPhoneWACode);
router.post(
  "/verify-phone",
  userValidator.verifyPhoneValidator,
  userController.verifyPhone
);

router.use(authController.restrictTo("admin"));

router
  .route("/admin")
  .post(userValidator.addAdminValidator, userController.addAdmin);

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userValidator.getUserValidator, userController.getUser)
  .delete(userValidator.getUserValidator, userController.deleteUser);

router.post(
  "/messages",
  userController.uploadMediaImage,
  userValidator.validateSendUsersMessage,
  userController.sendUsersMessage
);

module.exports = router;
