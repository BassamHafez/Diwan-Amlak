import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfo-slice";
import profileSlice from "./profileInfo-slice";
import accountSlice from "./accountInfo-slice";
import configsSlice from "./configs-slice";
import packageTimeSlice from "./packageTime-slice";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    profileInfo: profileSlice.reducer,
    accountInfo: accountSlice.reducer,
    configs: configsSlice.reducer,
    packageTime:packageTimeSlice.reducer
  },
});

export default store;
