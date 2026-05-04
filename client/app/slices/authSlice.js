import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null, // 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;

      // ✅ Safe check (client only)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      // ✅ Safe check
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;