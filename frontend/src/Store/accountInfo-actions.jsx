import axios from "axios";
import { accountActions } from "./accountInfo-slice";

const baseServerUrl = import.meta.env.VITE_Base_API_URL;

const fetchAccountData = (token) => {
  return async (dispatch) => {
      try {
        const response = await axios.get(`${baseServerUrl}accounts/my-account`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = response.data;
        dispatch(accountActions.setAccountInfo(res.data));
      } catch (error) {
        console.error(error);
      }
  };
};

export default fetchAccountData;
