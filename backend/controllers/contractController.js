const Account = require("../models/accountModel");
const Contract = require("../models/contractModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const Revenue = require("../models/revenueModel");
const TenantContact = require("../models/tenantContactModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const calculateRevenues = require("../utils/calculateRevenues");
const { sendWAText } = require("../utils/sendWAMessage");
const { formatSaudiNumber } = require("../utils/formatNumbers");

const contractPopOptions = [
  {
    path: "tenant",
    select: "name phone phone2",
  },
];

exports.getAllContracts = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const [estate, contracts] = await Promise.all([
    Estate.findById(estateId).select("_id").lean(),

    Contract.find({ estate: estateId, account: req.user.account })
      .populate(contractPopOptions)
      .sort("startDate")
      .lean(),
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: contracts,
  });
});

exports.createContract = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const newStartDate = new Date(req.body.startDate);
  newStartDate.setHours(0, 0, 0, 0);
  const newEndDate = new Date(req.body.endDate);
  newEndDate.setHours(23, 59, 59, 999);

  if (newStartDate >= newEndDate) {
    return next(new ApiError("Start date must be before end date", 400));
  }

  const [overlappingContract, tenant] = await Promise.all([
    Contract.findOne({
      estate: estateId,
      startDate: { $lte: newEndDate },
      endDate: { $gte: newStartDate },
      status: { $nin: ["canceled", "completed"] },
    })
      .select("_id")
      .lean(),

    TenantContact.findById(req.body.tenant).select("name phone").lean(),
  ]);

  if (overlappingContract) {
    return next(
      new ApiError(
        "There is an contract overlapping with the selected dates",
        400
      )
    );
  }

  if (!tenant) {
    return next(new ApiError("No tenant found with that ID", 404));
  }

  const now = new Date();

  const isActiveContract = newStartDate <= now && newEndDate >= now;

  const estate = isActiveContract
    ? await Estate.findByIdAndUpdate(estateId, { status: "rented" })
    : await Estate.findById(estateId).select("_id name compound").lean();

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (estate.compound) req.body.compound = estate.compound;

  if (estate.landlord) req.body.landlord = estate.landlord;

  if (!req.body.landlord && estate.compound) {
    const compound = await Compound.findById(estate.compound)
      .select("landlord")
      .lean();

    req.body.landlord = compound.landlord;
  }

  const contract = await Contract.create({
    ...req.body,
    startDate: newStartDate,
    endDate: newEndDate,
    status: isActiveContract ? "active" : "upcoming",
    estate: estateId,
    account: req.user.account,
  });

  const scheduledMissionPromise = ScheduledMission.create({
    type: isActiveContract ? "CONTRACT_EXPIRATION" : "CONTRACT_ACTIVATION",
    scheduledAt: isActiveContract ? newEndDate : newStartDate,
    contractEndDate: newEndDate,
    estate: estateId,
    contract: contract._id,
  });

  const calculatedRevenues = calculateRevenues(contract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues, {
    ordered: false,
  });

  const [insertedRevenues] = await Promise.all([
    insertRevenuesPromise,
    scheduledMissionPromise,
  ]);

  const revenuesReminders = insertedRevenues.map((revenue) => ({
    type: "REVENUE_REMINDER",
    scheduledAt: new Date(revenue.dueDate).setHours(8, 0, 0, 0),
    revenue: revenue._id,
  }));

  ScheduledMission.insertMany(revenuesReminders, { ordered: false });

  sendWAText(
    formatSaudiNumber(tenant.phone),
    `Hello ${
      tenant.name
    }, You have a new contract starting on ${newStartDate.toLocaleDateString()} and ending on ${newEndDate.toLocaleDateString()} at "${
      estate.name
    }"

    \n\n
    مرحبا ${
      tenant.name
    }, لديك عقد جديد يبدأ في ${newStartDate.toLocaleDateString()} وينتهي في ${newEndDate.toLocaleDateString()} في "${
      estate.name
    }"`
  );

  res.status(201).json({
    status: "success",
    data: contract,
  });
});

exports.cancelContract = catchAsync(async (req, res, next) => {
  const { id, estateId } = req.params;

  const [estate, contract] = await Promise.all([
    Estate.findById(estateId).select("_id name").lean(),

    Contract.findOne({
      _id: id,
      account: req.user.account,
    })
      .select("status estate startDate endDate")
      .populate(contractPopOptions)
      .lean(),
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (!contract) {
    return next(new ApiError("No contract found with that ID", 404));
  }

  if (estate._id.toString() !== contract.estate._id.toString()) {
    return next(new ApiError("Contract does not belong to that estate", 400));
  }

  if (contract.status === "completed") {
    return next(new ApiError("Contract is already completed", 400));
  }

  const updateContractPromise = Contract.updateOne(
    { _id: id },
    { isCanceled: true, status: "canceled" }
  );

  const cancelOldRevenuesPromise = Revenue.updateMany(
    { contract: id, status: { $ne: "paid" } },
    { status: "canceled" }
  );

  const deleteOldScheduledMissionPromise = ScheduledMission.deleteOne({
    contract: id,
    isDone: false,
  });

  await Promise.all([
    updateContractPromise,
    deleteOldScheduledMissionPromise,
    cancelOldRevenuesPromise,
  ]);

  const now = new Date();
  const isActiveContract =
    new Date(contract.startDate) <= now && new Date(contract.endDate) >= now;

  if (isActiveContract) {
    await Estate.updateOne({ _id: estateId }, { status: "available" });
  }

  sendWAText(
    formatSaudiNumber(contract.tenant.phone),
    `Hello ${contract.tenant.name}, Your contract at "${estate.name}" has been canceled.

    \n\n
    مرحبا ${contract.tenant.name}, تم إلغاء عقدك في "${estate.name}"`
  );

  res.status(200).json({
    status: "success",
    message: "Contract canceled successfully",
  });
});

exports.updateContract = catchAsync(async (req, res, next) => {
  const { estateId, id } = req.params;

  const newStartDate = new Date(req.body.startDate);
  newStartDate.setHours(0, 0, 0, 0);
  const newEndDate = new Date(req.body.endDate);
  newEndDate.setHours(23, 59, 59, 999);

  if (newStartDate >= newEndDate) {
    return next(new ApiError("Start date must be before end date", 400));
  }

  const overlappingContract = await Contract.findOne({
    _id: { $ne: id },
    estate: estateId,
    startDate: { $lte: newEndDate },
    endDate: { $gte: newStartDate },
    status: { $nin: ["canceled", "completed"] },
  })
    .select("_id")
    .lean();

  if (overlappingContract) {
    return next(
      new ApiError(
        "There is an contract overlapping with the selected dates",
        400
      )
    );
  }

  const now = new Date();

  const isActiveContract = newStartDate <= now && newEndDate >= now;

  const estate = isActiveContract
    ? await Estate.findByIdAndUpdate(estateId, { status: "rented" })
    : await Estate.findById(estateId).select("_id compound").lean();

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  const updateContractPromise = Contract.findByIdAndUpdate(
    id,
    {
      ...req.body,
      status: isActiveContract ? "active" : "upcoming",
    },
    { new: true }
  );

  const cancelOldRevenuesPromise = Revenue.updateMany(
    { contract: id, status: { $ne: "paid" } },
    { status: "canceled" }
  );

  const deleteOldScheduledMissionPromise = ScheduledMission.findOneAndDelete({
    contract: id,
    isDone: false,
  });

  const [updatedContract] = await Promise.all([
    updateContractPromise,
    cancelOldRevenuesPromise,
    deleteOldScheduledMissionPromise,
  ]);

  const calculatedRevenues = calculateRevenues(updatedContract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues);

  const scheduledMissionPromise = ScheduledMission.create({
    type: isActiveContract ? "CONTRACT_EXPIRATION" : "CONTRACT_ACTIVATION",
    scheduledAt: isActiveContract ? newEndDate : newStartDate,
    contractEndDate: newEndDate,
    estate: estateId,
    contract: updatedContract._id,
  });

  const [insertedRevenues] = await Promise.all([
    insertRevenuesPromise,
    scheduledMissionPromise,
  ]);

  const revenuesReminders = insertedRevenues.map((revenue) => ({
    type: "REVENUE_REMINDER",
    scheduledAt: new Date(revenue.dueDate).setHours(8, 0, 0, 0),
    revenue: revenue._id,
  }));

  ScheduledMission.insertMany(revenuesReminders, { ordered: false });

  res.status(201).json({
    status: "success",
    data: updatedContract,
  });
});

exports.getCurrentContract = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const contract = await Contract.findOne({
    estate: estateId,
    startDate: { $lte: new Date().setHours(23, 59, 59, 999) },
    endDate: { $gte: new Date().setHours(0, 0, 0, 0) },
    status: { $nin: ["canceled", "completed"] },
  })
    .populate(contractPopOptions)
    .select(
      "startDate endDate tenant totalAmount paymentPeriodValue paymentPeriodUnit isCanceled"
    )
    .lean();

  if (!contract) {
    return res.status(200).json({
      status: "success",
      data: null,
    });
  }

  const nextRevenue = await Revenue.findOne({
    contract: contract._id,
    status: "pending",
  })
    .sort("dueDate")
    .select("amount dueDate type status")
    .lean();

  res.status(200).json({
    status: "success",
    data: {
      contract,
      nextRevenue,
    },
  });
});

exports.extendContract = catchAsync(async (req, res, next) => {
  const { estateId, id } = req.params;
  const { endDate } = req.body;

  const newEndDate = new Date(endDate);
  newEndDate.setHours(23, 59, 59, 999);

  const [estate, contract] = await Promise.all([
    Estate.findById(estateId).select("_id name").lean(),

    Contract.findOne({
      _id: id,
      account: req.user.account,
    })
      .select("status estate startDate endDate")
      .populate(contractPopOptions)
      .lean(),
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (!contract) {
    return next(new ApiError("No contract found with that ID", 404));
  }

  if (estate._id.toString() !== contract.estate._id.toString()) {
    return next(new ApiError("Contract does not belong to that estate", 400));
  }

  if (contract.status === "completed") {
    return next(new ApiError("Contract is already completed", 400));
  }

  if (contract.status === "canceled") {
    return next(new ApiError("Contract is already canceled", 400));
  }

  if (newEndDate <= contract.startDate) {
    return next(new ApiError("End date must be after start date", 400));
  }

  const overlappingContract = await Contract.findOne({
    _id: { $ne: id },
    estate: estateId,
    startDate: { $lte: newEndDate },
    endDate: { $gte: contract.startDate },
    status: { $nin: ["canceled", "completed"] },
  })
    .select("_id")
    .lean();

  if (overlappingContract) {
    return next(
      new ApiError(
        "There is an contract overlapping with the selected dates",
        400
      )
    );
  }

  const isActiveContract = contract.status === "active" ? true : false;

  const updateContractPromise = Contract.updateOne(
    { _id: id },
    { endDate: newEndDate }
  );

  const deleteOldScheduledMissionPromise = ScheduledMission.deleteOne({
    contract: id,
    isDone: false,
  });

  const newScheduledMissionPromise = ScheduledMission.create({
    type: isActiveContract ? "CONTRACT_EXPIRATION" : "CONTRACT_ACTIVATION",
    scheduledAt: isActiveContract ? newEndDate : contract.startDate,
    contractEndDate: newEndDate,
    estate: estateId,
    contract: id,
  });

  await Promise.all([
    updateContractPromise,
    deleteOldScheduledMissionPromise,
    newScheduledMissionPromise,
  ]);

  res.status(200).json({
    status: "success",
    message: "Contract extended successfully",
  });
});

exports.settleContract = catchAsync(async (req, res, next) => {
  const { estateId, id } = req.params;
  const { settlementAmount, paymentMethod } = req.body;

  const [estate, contract] = await Promise.all([
    Estate.findById(estateId).select("_id name").lean(),

    Contract.findOne({
      _id: id,
      account: req.user.account,
    })
      .populate(contractPopOptions)
      .lean(),
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (!contract) {
    return next(new ApiError("No contract found with that ID", 404));
  }

  if (estate._id.toString() !== contract.estate._id.toString()) {
    return next(new ApiError("Contract does not belong to that estate", 400));
  }

  if (contract.status === "completed") {
    return next(new ApiError("Contract is already completed", 400));
  }

  if (contract.status === "canceled") {
    return next(new ApiError("Contract is already canceled", 400));
  }

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // const isActiveContract = contract.status === "active" ? true : false;
  const now = new Date();
  const isActiveContract = contract.startDate <= now && contract.endDate >= now;

  const cancelOldRevenuesPromise = Revenue.updateMany(
    { contract: id, status: { $ne: "paid" } },
    { status: "canceled" }
  );

  const updateContractPromise = Contract.updateOne(
    { _id: id },
    { status: "completed", endDate: endOfDay }
  );

  const updateEstatePromise = isActiveContract
    ? Estate.updateOne({ _id: estateId }, { status: "available" })
    : Promise.resolve();

  await Promise.all([
    cancelOldRevenuesPromise,
    updateContractPromise,
    updateEstatePromise,
  ]);

  const deleteOldScheduledMissionPromise = ScheduledMission.deleteOne({
    contract: id,
    isDone: false,
  });

  const settlementRevenuePromise = Revenue.create({
    contract: id,
    amount: settlementAmount,
    type: "settlement",
    dueDate: new Date(),
    status: "paid",
    paidAt: new Date(),
    paymentMethod,
    account: contract.account,
    tenant: contract.tenant,
    estate: contract.estate,
    compound: contract.compound || null,
    landlord: contract.landlord || null,
  });

  await Promise.all([
    deleteOldScheduledMissionPromise,
    settlementRevenuePromise,
  ]);

  sendWAText(
    formatSaudiNumber(contract.tenant.phone),
    `Hello ${contract.tenant.name}, Your contract at "${estate.name}" has been settled with an amount of ${settlementAmount} SAR.

    \n\n
    مرحبا ${contract.tenant.name}, تم تسوية عقدك في "${estate.name}" بمبلغ ${settlementAmount} ريال سعودي`
  );

  res.status(200).json({
    status: "success",
    message: "Contract settled successfully",
  });
});
