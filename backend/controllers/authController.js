const crypto = require("crypto");
const { promisify } = require("util");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Tag = require("../models/tagModel");
const Config = require("../models/configModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const { USER_ACCESS_PERMISSIONS } = require("../utils/globals");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId();
  const accountId = new mongoose.Types.ObjectId();

  const userData = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    account: accountId,
    permissions: USER_ACCESS_PERMISSIONS,
  };

  const [newUser, FREE_TRIAL_DAYS] = await Promise.all([
    User.create(userData),
    Config.findOne({ key: "TRIAL_DAYS" }).select("value").lean(),
  ]);

  const subExpireDate = new Date(
    Date.now() + FREE_TRIAL_DAYS.value * 24 * 60 * 60 * 1000
  );

  const accountData = {
    _id: accountId,
    owner: userId,
    subscriptionEndDate: subExpireDate,
    members: [
      {
        user: userId,
        tag: "owner",
        permissions: USER_ACCESS_PERMISSIONS,
      },
    ],
  };

  await Promise.all([
    Tag.create({ account: accountId }),
    Account.create(accountData),
    ScheduledMission.create({
      account: accountId,
      accountOwner: {
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      },
      type: "SUBSCRIPTION_EXPIRATION",
      scheduledAt: subExpireDate,
    }),
  ]);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(new ApiError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ phone }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ApiError("Incorrect phone or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.saveTokenAndUserIfExist = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) next();

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) next();

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };

exports.checkPermission = (requiredPermission) => (req, res, next) => {
  const { user } = req;

  if (!user.account) {
    return next(new ApiError("Access denied: Account not found", 403));
  }

  if (
    user.permissions?.length > 0 &&
    !user.permissions.includes(requiredPermission)
  ) {
    return next(new ApiError("Access denied: Missing permission", 403));
  }

  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with email provided", 404));
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const text = `Hi ${user.name},\n We received a request to reset the password on your Diwan Amlak Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Diwan Amlak Team`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .brand {
          color:#b1802b;
          font-weight: bold;
        }
        .code {
          font-size: 24px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We received a request to reset the password on your <span class="brand">Diwan Amlak</span> Account.</p>
      <p class="code">${resetCode}</p>
      <p>Enter this code to complete the reset.</p>
      <p>Thanks for helping us keep your account secure.</p>
      <p>The <span class="brand">Diwan Amlak</span> Team</p>
    </body>
    </html>
  `;

  try {
    await sendEmail(
      user.email,
      "Your password reset code (valid for 10 min)",
      text,
      html
    );
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    console.log(`Error in sending email. Time: ${new Date()}\n`, err);

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

exports.verifyPassResetCode = catchAsync(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid reset code or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with email provided", 404));
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  // const token = createToken(user._id);
  // res.status(200).json({ token });
  createSendToken(user, 200, res);
});
