import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  loggedInUser: "",
  accessToken: null,
  refreshToken: null,
  snackBar: {
    duration: 3000,
    message: "",
    type: "error", // 'success' || 'error' || 'info',
  },
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.authToken;
      state.refreshToken = action.payload.data.refreshToken;
      state.loggedInUser = action.payload.data.user.defaultRole;
    },
    setAuthToken: (state, action) => {
      state.accessToken = action.payload.data.authToken;
      state.refreshToken = action.payload.data.refreshToken;
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    setLogout: (state) => {
      state.user = "";
      state.loggedInUser = "";
      state.accessToken = null;
      state.refreshToken = null;
      state.snackBar = {
        duration: 3000,
        message: "",
        type: "error",
      };
    },
  },
});

// Selectors
export const getUser = (state) => state.entities.user;
export const getLoggedInUser = (state) => state.entities.user.loggedInUser;

export const { setUser, setLoggedInUser, setAuthToken, setLogout } =
  userReducer.actions;

export default userReducer.reducer;
