const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const tagController = require("../controllers/tagController");

router.use(authController.protect);

router.get("/", tagController.getAllTags);

module.exports = router;
