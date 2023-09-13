import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    notificationChange(state, action) {
      return action.payload;
    },
    resetNotification(state, action) {
      return "";
    },
  },
});

export const { notificationChange, resetNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
