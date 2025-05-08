const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const accountController = require("../controllers/accountController");
const accountValidator = require("../utils/validators/accountValidator");

router.use(authController.protect);

router.get(
  "/",
  authController.restrictTo("admin"),
  accountController.getAllAccounts
);

router.delete(
  "/:id",
  accountValidator.getAccountValidator,
  authController.restrictTo("admin"),
  accountController.deleteAccount
);

router.get("/my-account", accountController.getMyAccount);

router.get("/purchases", accountController.getMyPurchases);
router.get('/purchases/:id', accountController.checkPurchaseStatus);

router.patch(
  "/:id",
  authController.checkPermission("UPDATE_ACCOUNT"),
  accountValidator.updateAccountValidator,
  accountController.updateAccount
);

router.post(
  "/:id/members",
  accountValidator.addMemberValidator,
  accountController.addMember
);

router
  .route("/:id/members/:userId")
  .patch(accountValidator.updateMemberValidator, accountController.updateMember)
  .delete(
    accountValidator.deleteMemberValidator,
    accountController.deleteMember
  );

router.post(
  "/:id/subscribe",
  accountValidator.subscribeValidator,
  accountController.subscribe
);

router.post(
  "/:id/subscribe-package",
  accountValidator.subscribeInPackageValidator,
  accountController.subscribeInPackage
);

router.post(
  "/:id/vip",
  authController.restrictTo("admin"),
  accountValidator.validateAddVIP,
  accountController.addVIP
);

module.exports = router;
