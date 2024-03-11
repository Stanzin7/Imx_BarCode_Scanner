import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define an async thunk for the login process
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ emailAddress, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/login/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ClientID: "imxapp",
            ClientSecret: "6f5cc23a-7661-40aa-aac0-a484aaea228e",
          },
          body: JSON.stringify({
            EmailAddress: emailAddress,
            Password: password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not log in");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.emailAddress;
        state.accessToken = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setLogout } = userReducer.actions;
export default userReducer.reducer;
