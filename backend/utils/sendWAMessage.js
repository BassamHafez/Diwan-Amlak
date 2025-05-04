exports.sendWAText = async (phone, message) => {
  const url = `https://waapi.app/api/v1/instances/${process.env.WAAPI_INSTANCE_ID}/client/action/send-message`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${process.env.WAAPI_TOKEN}`,
    },
    body: JSON.stringify({ chatId: `${phone}@c.us`, message }),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
};

exports.sendWAMedia = async (phone, mediaUrl, mediaBase64, caption) => {
  const url = `https://waapi.app/api/v1/instances/${process.env.WAAPI_INSTANCE_ID}/client/action/send-media`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${process.env.WAAPI_TOKEN}`,
    },
    body: JSON.stringify({
      chatId: `${phone}@c.us`,
      ...(mediaUrl ? { mediaUrl } : { mediaBase64, mediaName: "image.png" }),
      mediaCaption: caption,
    }),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
};
