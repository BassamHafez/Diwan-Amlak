const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  feature: {
    type: String,
    required: [true, "Feature is required"],
  },
  price: {
    type: Number,
    min: 0,
    required: [true, "Price is required"],
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
