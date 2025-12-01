import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

/////
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

////
export const register = createAsyncThunk(
  "auth/register",
  async (form, { rejectWithValue }) => {
    try {
      const { data } = await api.post("auth.php/register", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (form, { rejectWithValue }) => {
    try {
      const { data } = await api.post("auth.php/login", form, {
        headers: { "Content-Type": "application/json" },
      });
      // await delay(3000);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
