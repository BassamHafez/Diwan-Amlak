import { userActions } from "./userInfo-slice";


//save data into locale storage
const saveUserInfoIntoLocalStorag = (userInfo) => {
  return () => {
    localStorage.setItem("userData", JSON.stringify(userInfo));
  };
};

export const saveIsLoginState = (isLoginState) => {
  return () => {
    localStorage.setItem("isLogin", JSON.stringify(isLoginState));
  };
};

export const saveRoleState = (role) => {
  return () => {
    localStorage.setItem("role", JSON.stringify(role));
  };
};

export const saveTokenState = (token) => {
  return () => {
    localStorage.setItem("token", JSON.stringify(token));
  };
};

//get from locale storage
export const getUserInfoFromLocalStorage = () => {
  return (dispatch) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    dispatch(userActions.setUserInfo(userData));
  };
};

export const getisLoginState = () => {
  return (dispatch) => {
    const isLogin = JSON.parse(localStorage.getItem("isLogin"));
    dispatch(userActions.setIsLogin(isLogin));
  };
};

export const getRoleState = () => {
  return (dispatch) => {
    const role = JSON.parse(localStorage.getItem("role"));
    dispatch(userActions.setRole(role));
  };
};

export const getToken = () => {
  return (dispatch) => {
    const token = JSON.parse(localStorage.getItem("token"));
    dispatch(userActions.setToken(token));
  };
};

export default saveUserInfoIntoLocalStorag;
