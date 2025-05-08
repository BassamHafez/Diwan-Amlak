const nodemailer = require("nodemailer");

const sendEmail = async (
  email,
  subject,
  text,
  html = null,
  attachments = null
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates (optional)
      },
    });

    const mailOpts = {
      from: "Diwan Amlak Website <" + process.env.EMAIL_USER + ">",
      to: email,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOpts);

    console.log("Email sent successfully:", info.messageId);
    return info; // Optional: return info for logging or debugging purposes
  } catch (error) {
    console.error("Error sending email:", error.message);

    throw error; // Rethrow the error if you want to handle it in the calling function
  }
};

module.exports = sendEmail;
