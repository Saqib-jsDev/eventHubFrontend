import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, register } from "./authThunk";
import { logOut } from "../actions/authActions";
const userfromLS = JSON.parse(localStorage.getItem("user")) || null;
const tokenfromLS = localStorage.getItem("token") || null;
// console.log(userfromLS);

const initialState = {
  user: userfromLS,
  token: tokenfromLS,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  /* reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  }, */
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log(action.payload);

        const { token, user } = action.payload;
        state.user = user;
        state.token = token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(loginThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(logOut, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});
// export const { logOut } = authSlice.actions;
export default authSlice.reducer;
