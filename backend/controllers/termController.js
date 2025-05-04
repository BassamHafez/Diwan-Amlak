const Term = require("../models/termModel");
const catchAsync = require("../utils/catchAsync");

exports.getTerms = catchAsync(async (req, res, next) => {
  const terms = await Term.findOne().select("-_id -__v").lean();

  res.status(200).json({
    status: "success",
    data: terms,
  });
});

exports.updateTerms = catchAsync(async (req, res, next) => {
  const { en, ar } = req.body;

  const updatedTerms = await Term.findOneAndUpdate(
    {},
    { en, ar },
    { new: true, upsert: true }
  ).select("-_id -__v");

  res.status(200).json({
    status: "success",
    data: updatedTerms,
  });
});
