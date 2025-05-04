const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllTags = catchAsync(async (req, res, next) => {
  const tags = await Tag.findOne({ account: req.user.account }, "tags").lean();

  res.status(200).json({
    status: "success",
    data: tags?.tags || [],
  });
});
