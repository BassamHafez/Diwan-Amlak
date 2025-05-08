const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const expenseController = require("../controllers/expenseController");
const expenseValidator = require("../utils/validators/expenseValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, expenseController.getAllExpenses)
  .post(
    authController.checkPermission("ADD_EXPENSE"),
    expenseValidator.createExpenseValidator,
    setAccountId,
    expenseController.createExpense
  );

router
  .route("/:id")
  .get(expenseValidator.getExpenseValidator, expenseController.getExpense)
  .patch(
    authController.checkPermission("UPDATE_EXPENSE"),
    expenseValidator.updateExpenseValidator,
    expenseController.updateExpense
  )
  .delete(
    authController.checkPermission("DELETE_EXPENSE"),
    expenseValidator.getExpenseValidator,
    expenseController.deleteExpense
  );

router.patch(
  "/:id/pay",
  authController.checkPermission("PAY_EXPENSE"),
  expenseValidator.payExpenseValidator,
  expenseController.payExpense
);

router.patch(
  "/:id/unpay",
  authController.checkPermission("UNPAY_EXPENSE"),
  expenseValidator.getExpenseValidator,
  expenseController.unpayExpense
);

router.patch(
  "/:id/cancel",
  authController.checkPermission("CANCEL_EXPENSE"),
  expenseValidator.getExpenseValidator,
  expenseController.cancelExpense
);

module.exports = router;
