const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const contactController = require("../controllers/contactController");
const { filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router.route("/").get(filterAccountResults, contactController.getAllContacts);

module.exports = router;
