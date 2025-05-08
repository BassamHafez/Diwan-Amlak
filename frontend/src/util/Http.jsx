import axios from "axios";
const baseServerUrl = import.meta.env.VITE_Base_API_URL;
const validFormMethods = ["post", "patch", "put"];

export const signFormsHandler = async ({ type, formData, method }) => {
  try {
    let response = null;
    if (method === "put") {
      response = await axios.put(
        `${baseServerUrl}auth/resetPassword`,
        formData
      );
    } else {
      response = await axios.post(`${baseServerUrl}auth/${type}`, formData);
    }
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response;
    } else if (error.request) {
      throw error.request;
    }
    throw error.message;
  }
};

export const mainFormsHandlerTypeFormData = async ({
  type,
  formData,
  method,
  token,
  isLimited,
}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  const myUrl = `${baseServerUrl}${type}`;

  try {
    let response = null;
    if (validFormMethods.includes(method)) {
      response = await axios[method](myUrl, formData, {
        headers,
      });
    } else {
      if (!token) {
        console.error("Unauthorized");
        return null;
      }
      response = await axios.get(myUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: isLimited ? { limit: Infinity } : undefined,
      });
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const mainFormsHandlerTypeRaw = async ({
  type,
  formData,
  method,
  token,
  isLimited,
}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const url = `${baseServerUrl}${type}`;
  try {
    let response = null;
    if (validFormMethods.includes(method)) {
      response = await axios[method](url, formData, {
        headers,
      });
    } else {
      response = await axios.get(url, {
        headers,
        params: isLimited ? { limit: Infinity } : undefined,
      });
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const mainDeleteFunHandler = async ({ id, token, type }) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_Base_API_URL}${type}/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const mainEmptyBodyFun = async ({ token, type, method }) => {
  try {
    const response = await axios[method](
      `${baseServerUrl}${type}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getPublicData = async ({ type }) => {
  try {
    const response = await axios.get(`${baseServerUrl}${type}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
