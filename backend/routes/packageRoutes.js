const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const packageController = require("../controllers/packageController");
const packageValidator = require("../utils/validators/packageValidator");

router.get("/", packageController.getAllPackages);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  packageValidator.createPackageValidator,
  packageController.createPackage
);

router
  .route("/:id")
  .patch(
    packageValidator.updatePackageValidator,
    packageController.updatePackage
  )
  .delete(
    packageValidator.deletePackageValidator,
    packageController.deletePackage
  );

module.exports = router;
