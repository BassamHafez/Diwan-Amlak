import axios from "axios";
import { configActions } from "./configs-slice";
const baseServerUrl = import.meta.env.VITE_Base_API_URL;

const findConfigByKey = (arr, targetKey) => {
  return Array.isArray(arr)
    ? arr.find((config) => config.key === targetKey)
    : undefined;
};

const fetchConfigs = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${baseServerUrl}configs`);
      const res = response?.data;

      dispatch(
        configActions.setMainColor(
          findConfigByKey(res?.data, "MAIN_COLOR")?.value
        )
      );
      dispatch(
        configActions.setSubColor(
          findConfigByKey(res?.data, "SECONDRY_COLOR")?.value
        )
      );
      dispatch(
        configActions.setInstagramLink(
          findConfigByKey(res?.data, "INSTAGRAM")?.value
        )
      );
      dispatch(
        configActions.setTwitterLink(
          findConfigByKey(res?.data, "TWITTER")?.value
        )
      );
      dispatch(
        configActions.setWhatsappNumber(
          findConfigByKey(res?.data, "WHATSAPP")?.value
        )
      );
      dispatch(
        configActions.setEmail(findConfigByKey(res?.data, "EMAIL")?.value)
      );
      dispatch(configActions.setVAT(findConfigByKey(res?.data, "VAT")?.value));
      dispatch(
        configActions.setFreeTrail(
          findConfigByKey(res?.data, "TRIAL_DAYS")?.value
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
};

export default fetchConfigs;
