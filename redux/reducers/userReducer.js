import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
            ClientID: "imxshop",
            ClientSecret: "ce26ea60-6075-4e96-bf0d-e849b58b213c",
          },
          body: JSON.stringify({
            EmailAddress: emailAddress,
            Password: password,
          }),
        }
      );
      const data = await response.json();
      // if (!response.ok) throw new Error(data.message || "Could not log in");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchItem = createAsyncThunk(
  "user/fetchItem",
  async ({ itemNumber, acctNo, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/itemrecs/${itemNumber}/${
          acctNo || ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not fetch item");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const searchItemByBarcode = createAsyncThunk(
  "user/searchItemByBarcode",

  async ({ barcodeId, token }, { rejectWithValue }) => {
    console.log("Using token for request:", token);

    try {
      const pageNo = 0;
      const pageSize = 200; // Adjust pageSize if necessary
      const response = await fetch(
        `https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/itemrecs/search/${barcodeId}/${pageNo}/${pageSize}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            ClientID: "imxshop",
            ClientSecret: "ce26ea60-6075-4e96-bf0d-e849b58b213c",
          },
        }
      );

      // console.log("Response Status:", response.status); // Log the response status code
      // // Optionally log all headers (some environments might not allow direct logging of headers object)
      // response.headers.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });

      const data = await response.json();
      console.log("Response Data:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error("Search API response:", data);
        throw new Error(data.message || "Could not find item by barcode");
      }

      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Search API error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  item: null,
  searchResult: null, // Added to store search results
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.item = null;
      state.searchResult = null;
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
      })
      .addCase(fetchItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.item = action.payload;
      })
      .addCase(fetchItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(searchItemByBarcode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchItemByBarcode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResult = action.payload;
      })
      .addCase(searchItemByBarcode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setLogout } = userReducer.actions;
export default userReducer.reducer;
