const express = require("express");
const router = express.Router({ mergeParams: true });

const authController = require("../controllers/authController");
const contractController = require("../controllers/contractController");
const contractValidator = require("../utils/validators/contractValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

// /api/v1/estates/:estateId/contracts
router
  .route("/")
  .get(
    contractValidator.getContractsValidator,
    filterAccountResults,
    contractController.getAllContracts
  )
  .post(
    authController.checkPermission("ADD_CONTRACT"),
    contractValidator.createContractValidator,
    setAccountId,
    contractController.createContract
  );

router.get(
  "/current",
  contractValidator.getContractsValidator,
  contractController.getCurrentContract
);

// /api/v1/estates/:estateId/contracts/:id
router
  .route("/:id")
  .patch(
    authController.checkPermission("UPDATE_CONTRACT"),
    contractValidator.updateContractValidator,
    contractController.updateContract
  )
  .delete(
    authController.checkPermission("CANCEL_CONTRACT"),
    contractValidator.getContractValidator,
    contractController.cancelContract
  );

router.put(
  "/:id/extend",
  authController.checkPermission("UPDATE_CONTRACT"),
  contractValidator.extendContractValidator,
  contractController.extendContract
);

router.put(
  "/:id/settle",
  authController.checkPermission("UPDATE_CONTRACT"),
  contractValidator.settleContractValidator,
  contractController.settleContract
);

module.exports = router;
