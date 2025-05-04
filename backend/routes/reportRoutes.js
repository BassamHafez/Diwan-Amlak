const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const reportController = require("../controllers/reportController");
const reportValidator = require("../utils/validators/reportValidator");

router.use(authController.protect, authController.restrictTo("user"));

// Financial Reports (Lessor)

router.post(
  "/income",
  authController.checkPermission("FINANCIAL_REPORTS"),
  reportValidator.validateIncomeReport,
  reportController.getIncomeReport
);

router.post(
  "/income-details",
  authController.checkPermission("FINANCIAL_REPORTS"),
  reportValidator.validateIncomeReport,
  reportController.getIncomeDetailsReport
);

router.post(
  "/payments",
  authController.checkPermission("FINANCIAL_REPORTS"),
  reportValidator.validatePaymentsReport,
  reportController.getPaymentsReport
);

// Operational Reports

router.post(
  "/contracts",
  authController.checkPermission("CONTRACTS_REPORTS"),
  reportValidator.validateContractsReport,
  reportController.getContractsReport
);

// Compounds Reports

router.post(
  "/compounds",
  authController.checkPermission("COMPOUNDS_REPORTS"),
  reportValidator.validateCompoundsReport,
  reportController.getCompoundsReport
);

router.post(
  "/compound-details",
  authController.checkPermission("COMPOUNDS_REPORTS"),
  reportValidator.validateCompoundDetailsReport,
  reportController.getCompoundDetailsReport
);

module.exports = router;
