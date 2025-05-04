const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "/users/default.png",
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
