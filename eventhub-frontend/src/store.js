import { configureStore } from "@reduxjs/toolkit";
import authReducer from "/src/features/auth/authSlice";
import eventsSlice from "/src/features/events/eventsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsSlice,
  },
});
export default store;
