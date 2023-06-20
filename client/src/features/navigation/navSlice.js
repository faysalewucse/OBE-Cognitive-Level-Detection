import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nav: "myquizes",
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    controlNav(state) {
      state.nav = state.nav === "myquizes" ? "participation" : "myquizes";
    },
  },
});

export const { controlNav } = navSlice.actions;
export default navSlice.reducer;
