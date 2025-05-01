import { createSlice } from "@reduxjs/toolkit";

const configsSlice = createSlice({
  name: "configs",
  initialState: {
    mainColor: "#d39833",
    subColor: "#2a3a47",
    instagramLink: "",
    twitterLink: "",
    whatsappNumber: "",
    email: "",
    VAT: "0",
    TRIAL_DAYS: "5",
  },
  reducers: {
    setMainColor(state, action) {
      state.mainColor = action.payload;
    },
    setSubColor(state, action) {
      state.subColor = action.payload;
    },
    setInstagramLink(state, action) {
      state.instagramLink = action.payload;
    },
    setTwitterLink(state, action) {
      state.twitterLink = action.payload;
    },
    setWhatsappNumber(state, action) {
      state.whatsappNumber = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setVAT(state, action) {
      state.VAT = action.payload;
    },
    setFreeTrail(state, action) {
      state.TRIAL_DAYS = action.payload;
    },
  },
});

export default configsSlice;
export const configActions = configsSlice.actions;
