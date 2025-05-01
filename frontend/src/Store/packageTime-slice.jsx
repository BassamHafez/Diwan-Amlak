import { createSlice } from "@reduxjs/toolkit";

const packageTimeSlice = createSlice({
  name: "packageTime",
  initialState: {
    isTimeExpired: false,
  },

  reducers: {
    setIsPackageTimeExpired(state, action) {
      state.isTimeExpired = action.payload;
    },
  },
});

export default packageTimeSlice;
export const packageTimeActions = packageTimeSlice.actions;
