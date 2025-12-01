import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const token = localStorage.getItem("token");
console.log(token);
export const getEvents = createAsyncThunk(
  "events/getEvents",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const tokenFromState = auth.token;
      const { data } = await api.get("events.php/events", {
        headers: {
          Authorization: `Bearer ${tokenFromState}`,
        },
      });

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/create",
  async (eventForm, { rejectWithValue }) => {
    try {
      const { data } = await api.post("events.php/events", eventForm, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editEvent = createAsyncThunk(
  "events/edit",
  async (eventForm, { rejectWithValue }) => {
    try {
      ///
      const { id } = eventForm;
      const { data } = api.put(`events.php/events/${id}`, eventForm, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const delEvent = createAsyncThunk(
  "event/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`events.php/events/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const approveEvent = createAsyncThunk(
  "events/approve",
  async (form, { rejectWithValue }) => {
    const { id } = form;
    try {
      const { data } = await api.patch(
        `events.php/events/${id}/approve`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
