const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const estateController = require("../controllers/estateController");
const estateValidator = require("../utils/validators/estateValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

// Favorites

router
  .route("/:id/favorites")
  .post(
    authController.checkPermission("FAVORITES"),
    estateValidator.getEstateValidator,
    setAccountId,
    estateController.favoriteEstate
  )
  .delete(
    authController.checkPermission("FAVORITES"),
    estateValidator.getEstateValidator,
    estateController.unfavoriteEstate
  );

router
  .route("/")
  .get(filterAccountResults, estateController.getAllEstates)
  .post(
    authController.checkPermission("ADD_ESTATE"),
    estateController.uploadEstateImage,
    estateController.resizeEstateImage,
    estateValidator.createEstateValidator,
    setAccountId,
    estateController.createEstate
  );

router
  .route("/:id")
  .get(estateValidator.getEstateValidator, estateController.getEstate)
  .patch(
    authController.checkPermission("UPDATE_ESTATE"),
    estateController.uploadEstateImage,
    estateController.resizeEstateImage,
    estateValidator.updateEstateValidator,
    estateController.updateEstate
  )
  .delete(estateValidator.getEstateValidator, estateController.deleteEstate);

// Estate expenses

router
  .route("/:id/expenses")
  .get(estateValidator.getEstateValidator, estateController.getEstateExpenses)
  .post(
    authController.checkPermission("ADD_EXPENSE"),
    estateValidator.createEstateExpenseValidator,
    setAccountId,
    estateController.createEstateExpense
  );

module.exports = router;
