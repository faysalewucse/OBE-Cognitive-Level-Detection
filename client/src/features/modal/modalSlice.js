import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addQuizModal: false,
  participateModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    controlAddQuizModal(state) {
      state.addQuizModal = !state.addQuizModal;
    },
    controlParticipateModal(state) {
      state.participateModal = !state.participateModal;
    },
  },
});

export const { controlAddQuizModal, controlParticipateModal } =
  modalSlice.actions;
export default modalSlice.reducer;
