const Message = require("../models/messageModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");
const { sendWAText } = require("../utils/sendWAMessage");
const { formatSaudiNumber } = require("../utils/formatNumbers");

const popOptions = [
  {
    path: "account",
    select:
      "owner name phone email address region city subscriptionEndDate isVIP createdAt",
  },
];

exports.getAllSupportMessages = factory.getAll(Message, popOptions);
exports.deleteSupportMessage = factory.deleteOne(Message);

exports.createSupportMessage = catchAsync(async (req, res, next) => {
  if (req.user) {
    req.body.user = req.user.id;
    req.body.account = req.user.account;
  }

  await Promise.all([
    Message.create(req.body),

    sendEmail(
      process.env.SUPPORT_EMAIL,
      req.body.subject || "New Support Message",
      `${req.body.name} <${req.body.email}>:\n\n${req.body.message}`
    ),
  ]);

  res.status(200).json({
    status: "success",
    message: "Message sent successfully",
  });
});

exports.updateSupportMessageStatus = catchAsync(async (req, res, next) => {
  const msgId = req.params.id;
  const { status } = req.body;

  const message = await Message.findByIdAndUpdate(
    msgId,
    { status },
    { new: true, runValidators: true }
  ).populate("user", "name email phone");

  if (!message) {
    return next(new ApiError("Message not found", 404));
  }

  if (status === "completed") {
    if (message.email || message.user.email) {
      sendEmail(
        message.email || message.user.email,
        "Support Message Completed",
        `تم إغلاق طلب الدعم الخاص بك  تحت عنوان "${message.subject}"\n\n` +
          `نشكرك على صبرك وتفهمك.\n\n` +
          `إذا كان لديك أي استفسارات أخرى، فلا تتردد في التواصل معنا.`
      );
    }

    if (message.phone || message.user.phone) {
      const phone = formatSaudiNumber(message.phone || message.user.phone);
      sendWAText(
        phone,
        `تم إغلاق طلب الدعم الخاص بك  تحت عنوان "${message.subject}"\n\n` +
          `نشكرك على صبرك وتفهمك.\n\n` +
          `إذا كان لديك أي استفسارات أخرى، فلا تتردد في التواصل معنا.`
      );
    }
  }

  res.status(200).json({
    status: "success",
    message: "Message status updated successfully",
  });
});
