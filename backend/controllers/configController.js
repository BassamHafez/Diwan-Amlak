const sharp = require("sharp");
const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");
const { uploadMixOfImages } = require("../utils/uploadImage");

exports.getConfigs = catchAsync(async (req, res, next) => {
  const configs = await Config.find().select("key value -_id").lean();

  res.status(200).json({
    status: "success",
    data: configs,
  });
});

exports.updateConfigs = catchAsync(async (req, res, next) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  const promises = keys.map(async (key, index) => {
    const config = await Config.findOneAndUpdate(
      { key },
      { value: values[index] },
      { new: true }
    );
    return config;
  });

  const configs = await Promise.all(promises);

  res.status(200).json({
    status: "success",
    data: configs,
  });
});

exports.uploadSecondaryBanners = uploadMixOfImages([
  { name: "banner1", maxCount: 1 },
  { name: "banner2", maxCount: 1 },
]);

exports.updateSecondaryBanners = catchAsync(async (req, res, next) => {
  const banner1Name = "banner1.webp";
  const banner2Name = "banner2.webp";
  const banner1ImagePath = `/designs/${banner1Name}`;
  const banner2ImagePath = `/designs/${banner2Name}`;

  if (req.files?.banner1) {
    await sharp(req.files.banner1[0].buffer)
      .toFormat("webp")
      .webp({ quality: 100 })
      .toFile(`uploads/designs/${banner1Name}`);
  }

  if (req.files?.banner2) {
    await sharp(req.files.banner2[0].buffer)
      .toFormat("webp")
      .webp({ quality: 100 })
      .toFile(`uploads/designs/${banner2Name}`);
  }

  res.status(200).json({
    status: "success",
    data: {
      banner1ImagePath,
      banner2ImagePath,
    },
  });
});
