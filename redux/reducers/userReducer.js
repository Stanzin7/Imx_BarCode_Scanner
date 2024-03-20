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
      // console.log(data);
      if (!response.ok) throw new Error(data.message || "Could not log in");
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
            ClientID: "imxshop",
            ClientSecret: "ce26ea60-6075-4e96-bf0d-e849b58b213c",
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
    // console.log("Using token for request:", token);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not find item by barcode");
      }

      const item = Array.isArray(data) ? data[0] : data;
      // console.log("Response Data:", JSON.stringify(matchingItem, null, 2));
      return item || null;
      // return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Search API error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const submitOrder = createAsyncThunk(
  "user/submitOrder",
  async (orderDetails, { getState, rejectWithValue }) => {
    const state = getState();
    try {
      const response = await fetch(
        "https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/Webordersrecs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user.accessToken}`,
            ClientID: "imxshop",
            ClientSecret: "ce26ea60-6075-4e96-bf0d-e849b58b213c",
          },
          body: JSON.stringify(orderDetails),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit order");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || error.toString());
    }
  }
);

export const fetchCompanyInfo = createAsyncThunk(
  "user/fetchCompanyInfo",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    try {
      const response = await fetch(
        "https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/Webconfigrecs",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.user.accessToken}`,
            ClientID: "imxshop",
            ClientSecret: "ce26ea60-6075-4e96-bf0d-e849b58b213c",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch company info");
      }
      const data = await response.json();
      return {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        phone: data.phone,
        fax1: data.fax1,
        fax2: data.fax2,
        newCustomerEmail: data.newCustomerEmail,
        newOrderEmail: data.newOrderEmail,
      };
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
  item: null,
  searchResult: null,
  searchResult: null,
  companyInfo: null,
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogout: (state) => {
      Object.assign(state, initialState);
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
        const customerInfo = action.payload.customers[0];
        state.user = {
          emailAddress: action.payload.emailAddress,
          lastLogin: action.payload.lastLogin,
          acctNo: customerInfo.acctNo,
          company: customerInfo.company,
        };
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
      })
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        // Update the state with the fetched company info
        state.companyInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        // Optionally handle error
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setLogout } = userReducer.actions;
export default userReducer.reducer;
