import { useDispatch } from "react-redux";
import { userActions } from "../Store/userInfo-slice";
import { saveIsLoginState } from "../Store/userInfo-actions";
import { profileActions } from "../Store/profileInfo-slice";

const useSignOut = () => {
  const dispatch = useDispatch();

  const signOut = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("lastNotificationTime");
    if (localStorage.getItem("paymentId")) {
      localStorage.removeItem("paymentId");
    }

    dispatch(userActions.setRole(""));
    dispatch(userActions.setIsLogin(false));
    dispatch(saveIsLoginState(false));
    dispatch(userActions.setRole(""));
    dispatch(profileActions.setProfileInfo(null));
  };

  return signOut;
};

export default useSignOut;
