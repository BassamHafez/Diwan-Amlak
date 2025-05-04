const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const subscriptionController = require("../controllers/subscriptionController");

router.get("/", subscriptionController.getSubscriptions);

router.use(authController.protect, authController.restrictTo("admin"));

router.route("/").put(subscriptionController.updateSubscription);

module.exports = router;
