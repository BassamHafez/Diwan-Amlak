const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const compoundController = require("../controllers/compoundController");
const compoundValidator = require("../utils/validators/compoundValidator");
const { filterAccountResults, setAccountId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, compoundController.getAllCompounds)
  .post(
    authController.checkPermission("ADD_COMPOUND"),
    compoundController.uploadCompoundImage,
    compoundController.resizeCompoundImage,
    compoundValidator.createCompoundValidator,
    setAccountId,
    compoundController.createCompound
  );

router
  .route("/:id")
  .get(compoundValidator.getCompoundValidator, compoundController.getCompound)
  .patch(
    authController.checkPermission("UPDATE_COMPOUND"),
    compoundController.uploadCompoundImage,
    compoundController.resizeCompoundImage,
    compoundValidator.updateCompoundValidator,
    compoundController.updateCompound
  )
  .delete(
    authController.checkPermission("DELETE_COMPOUND"),
    compoundValidator.getCompoundValidator,
    compoundController.deleteCompound
  );

router.get(
  "/:id/current-contracts",
  compoundValidator.getCompoundValidator,
  compoundController.getCurrentContracts
);

// Compound expenses

router
  .route("/:id/expenses")
  .get(
    compoundValidator.getCompoundValidator,
    compoundController.getCompoundExpenses
  )
  .post(
    authController.checkPermission("ADD_EXPENSE"),
    compoundValidator.createCompoundExpenseValidator,
    setAccountId,
    compoundController.createCompoundExpense
  );

module.exports = router;
