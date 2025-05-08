const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const termController = require("../controllers/termController");
const termValidator = require("../utils/validators/termValidator");

router.get("/", termController.getTerms);

router.use(authController.protect, authController.restrictTo("admin"));

router.put("/", termValidator.validateUpdateTerms, termController.updateTerms);

module.exports = router;
