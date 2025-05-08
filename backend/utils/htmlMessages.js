exports.newMemberHtml = (phone, password) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Diiwan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            color: #d39833;
        }
        .content {
            margin-bottom: 20px;
        }
        .credentials {
            font-family: "Courier New", monospace;
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #d39833;
        }
        a {
            color: #d39833;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to <a href="https://www.diiwan.com" target="_blank">Diiwan.com</a></h1>
        </div>
        <div class="content">
            <p>Your account has been created successfully. Here are your login credentials:</p>
            <div class="credentials">
                <p>Phone: <strong>+${phone}</strong></p>
                <p>Password: <strong>${password}</strong></p>
            </div>
        </div>
        <div class="footer">
            <p>Thank you for choosing <a href="https://www.diiwan.com" target="_blank">Diiwan.com</a>!</p>
        </div>
    </div>
</body>
</html>
  `;
};

exports.subscriptionExpirationHtml = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Ended</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #d39833;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
            text-align: center;
            color: #333333;
        }
        .content p {
            margin: 10px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #d39833;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
            background-color: #f4f4f4;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Subscription Ended</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>We wanted to let you know that your subscription to <a href="diiwan.com" target="_blank" style="color: #d39833; text-decoration: none;"> <strong>Diiwan.com</strong> </a> has ended.</p>
            <p>Don’t miss out on the benefits of our services. Renew your subscription today to continue enjoying uninterrupted access!</p>
            <a href="https://diiwan.com/packages" class="cta-button">Renew Subscription</a>
        </div>
        <div class="footer">
            <p>Thank you for being part of Diiwan.com</p>
            <p>If you have any questions, feel free to <a href="[Contact Us Link]" style="color: #d39833; text-decoration: none;">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
    `;
};

exports.messageToUserHtml = (message) => {
  return `
  <div style="line-height: 1.6; padding: 5px;">
  <p style="font-size: 18px;">${message}</p>
    </div>
    `;
};
