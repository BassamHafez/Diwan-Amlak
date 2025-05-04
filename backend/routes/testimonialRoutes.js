const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const testimonialController = require("../controllers/testimonialController");
const testimonialValidator = require("../utils/validators/testimonialValidator");

router.get("/", testimonialController.getAllTestimonials);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  testimonialController.uploadTestimonialImage,
  testimonialController.resizeTestimonialImage,
  testimonialValidator.validateAddTestimonial,
  testimonialController.addTestimonial
);

router
  .route("/:id")
  .patch(
    testimonialController.uploadTestimonialImage,
    testimonialController.resizeTestimonialImage,
    testimonialValidator.validateUpdateTestimonial,
    testimonialController.updateTestimonial
  )
  .delete(
    testimonialValidator.validateGetTestimonial,
    testimonialController.deleteTestimonial
  );

module.exports = router;
