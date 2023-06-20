import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "../features/modal/modalSlice";
import navSlice from "../features/navigation/navSlice";

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    nav: navSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares(),
});
