const crypto = require("crypto");
const sharp = require("sharp");
const { uploadSingleImage } = require("../utils/uploadImage");
const { sendWAText, sendWAMedia } = require("../utils/sendWAMessage");
const sendEmail = require("../utils/sendEmail");
const { messageToUserHtml } = require("../utils/htmlMessages");
const { formatSaudiNumber } = require("../utils/formatNumbers");

const User = require("../models/userModel");
const Account = require("../models/accountModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const accountPopOptions = [
  {
    path: "account",
    select: "name phone address region city",
  },
];

const userSelectedFields = "-permissions -permittedCompounds";

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User, [], userSelectedFields);
exports.getUser = factory.getOne(User, accountPopOptions);

exports.uploadUserPhoto = uploadSingleImage("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(500, 500)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/users/${req.file.filename}`);

  req.body.photo = `/users/${req.file.filename}`;

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email", "photo", "phone");
  if (req.body?.photo) {
    filteredBody.photo = req.body.photo;
  }

  if (req.body?.phone && req.user.role !== "admin") {
    filteredBody.phoneVerified = false;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new ApiError("current password is wrong", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

exports.getPhoneWACode = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  user.phoneVerificationCode = hashedVerificationCode;

  await Promise.all([
    user.save(),
    sendWAText(
      formatSaudiNumber(user.phone),
      `Your verification code is ${verificationCode}

      \n\n
      كود التحقق الخاص بك هو ${verificationCode}`
    ),
  ]);

  res.status(200).json({
    status: "success",
    message: "Verification code sent to your whatsapp",
  });
});

exports.verifyPhone = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(req.body.verificationCode)
    .digest("hex");

  if (user.phoneVerificationCode !== hashedVerificationCode) {
    return next(new ApiError("Verification code is wrong", 400));
  }

  user.phoneVerificationCode = undefined;
  user.phoneVerified = true;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Phone verified successfully",
  });
});

exports.addAdmin = catchAsync(async (req, res, next) => {
  const adminData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: "admin",
    phoneVerified: true,
  };

  await User.create(adminData);

  res.status(201).json({
    status: "success",
    message: "Admin added successfully",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const [user, account] = await Promise.all([
    User.findByIdAndDelete(userId),
    Account.findOne({ owner: userId }).select("members").lean(),
  ]);

  if (!user) {
    return next(new ApiError("No user found with that ID", 404));
  }

  if (account) {
    const membersIds = account.members.map((member) => member.user);

    await Promise.all([
      User.deleteMany({ _id: { $in: membersIds } }, { ordered: false }),
      Account.deleteOne({ owner: userId }),
    ]);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.uploadMediaImage = uploadSingleImage("image");

exports.sendUsersMessage = catchAsync(async (req, res, next) => {
  const { message, type, emailSubject, usersIds } = req.body;

  const users = await User.find({ _id: { $in: usersIds } })
    .select("phone email")
    .lean();

  if (!users.length) {
    return next(new ApiError("No users found with that IDs", 404));
  }

  let mediaBase64 = null;
  let msgHtml = messageToUserHtml(message);
  let attachments = null;

  if (req.file && req.file.buffer) {
    mediaBase64 = req.file.buffer.toString("base64");

    msgHtml = messageToUserHtml(
      message,
      mediaBase64,
      req.file.mimetype.split("/")[1].replace(" ", "")
    );

    attachments = [
      {
        filename: `image-from-diwan.${req.file.mimetype
          .split("/")[1]
          .replace(" ", "")}`,
        content: mediaBase64,
        encoding: "base64",
        contentType: req.file.mimetype,
      },
    ];
  }

  if (type === "whatsapp") {
    if (mediaBase64) {
      users.forEach((user) => {
        sendWAMedia(formatSaudiNumber(user.phone), null, mediaBase64, message);
      });
    } else {
      users.forEach((user) => {
        sendWAText(formatSaudiNumber(user.phone), message);
      });
    }
  } else if (type === "email") {
    users.forEach((user) => {
      sendEmail(user.email, emailSubject, message, msgHtml, attachments);
    });
  } else {
    return next(new ApiError("Invalid message type", 400));
  }

  res.status(200).json({
    status: "success",
    message: "Messages are being processed to be sent",
  });
});
