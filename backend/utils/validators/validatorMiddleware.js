const { validationResult } = require("express-validator");
const ApiError = require("../ApiError");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    return next(new ApiError(errors.array()[0].msg, 400));
  }
  next();
};

module.exports = validatorMiddleware;
