const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/apifeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ApiError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new ApiError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions = [], selectedFields = "") =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id, selectedFields);

    const doc = await query.populate(popOptions).lean();

    if (!doc) {
      return next(new ApiError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model, popOptions = [], selectedFields = "") =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    const features = new APIFeatures(
      Model.find(filter, selectedFields),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const [totalDocs, docs] = await Promise.all([
      Model.countDocuments(filter),
      features.query.populate(popOptions).lean(),
    ]);

    const limit = +req.query.limit || 100;
    const totalPages = Math.ceil(totalDocs / limit);

    res.status(200).json({
      status: "success",
      results: docs.length,
      totalPages,
      data: docs,
    });
  });
