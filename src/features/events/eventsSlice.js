import { createSlice } from "@reduxjs/toolkit";
import {
  approveEvent,
  createEvent,
  delEvent,
  editEvent,
  getEvents,
} from "./eventsThunk";
import { logOut } from "../actions/authActions";

const initialState = {
  events: [],
  loading: false,
  error: null,
};
const eventsSlice = createSlice({
  name: "events",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload.event);
        state.loading = false;
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editEvent.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(editEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(delEvent.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (event) => event.id !== action.payload.event.id
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(delEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveEvent.pending, (state, action) => {
        state.pending = true;
      })
      .addCase(approveEvent.fulfilled, (state, action) => {
        state.events.forEach((event) => {
          const { approved, ApprovedEventID } = action.payload;

          if (event.id === ApprovedEventID) {
            event.approved = approved ? 1 : 0;
          }
        });
        state.loading = false;
      })
      .addCase(approveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logOut, () => initialState);
  },
});

export default eventsSlice.reducer;
