import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    createNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return "";
    },
  },
});

export const { createNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, duration) => {
  return (dispatch) => {
    dispatch(createNotification(message));
    setTimeout(() => dispatch(clearNotification()), duration * 1000);
  };
};

export default notificationSlice.reducer;
