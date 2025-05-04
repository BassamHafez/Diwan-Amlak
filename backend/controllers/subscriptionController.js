const Subscription = require("../models/subscriptionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.getSubscriptions = factory.getAll(Subscription, [], "-_id");

exports.updateSubscription = catchAsync(async (req, res, next) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  const promises = keys.map(async (key, index) => {
    const subscription = await Subscription.findOneAndUpdate(
      { feature: key },
      { price: values[index] }
    );
    return subscription;
  });

  const subscriptions = await Promise.all(promises);

  res.status(200).json({
    status: "success",
    // data: subscriptions,
    message: "Subscriptions updated successfully",
  });
});
