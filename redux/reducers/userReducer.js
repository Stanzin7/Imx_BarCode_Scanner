import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyConfigs from "../../config/companyConfig";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    { emailAddress, password, companyName },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const normalizedCompanyName = companyName
        .trim()
        .toUpperCase()
        .replace(/_/g, "");
      const companyKey = Object.keys(companyConfigs).find((key) => {
        return key.toUpperCase().replace(/_/g, " ") === normalizedCompanyName;
      });
      if (!companyKey) {
        throw new Error(`Company '${companyName}' not found in config`);
      }

      const company = companyConfigs[companyKey];
      const response = await fetch(`${company.loginUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ClientID: company.clientID,
          ClientSecret: company.clientSecret,
        },
        body: JSON.stringify({
          EmailAddress: emailAddress,
          Password: password,
        }),
      });
      let data = await response.json();
      if (!response.ok)
        throw new Error(
          `${
            data.message || "Could not log in"
          }\nplease check your credentials and try again`
        );
      data = { ...data, companyName: company }; // Simulated response with companyName
      AsyncStorage.setItem("companyName", companyName);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchItem = createAsyncThunk(
  "user/fetchItem",
  async ({ itemNumber, acctNo, token }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const company = state?.user?.user?.company;
      const apiUrl = company?.apiUrl;
      const response = await fetch(
        // `https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/itemrecs/${itemNumber}/${
        //   acctNo || ""
        // }`,
        `${apiUrl}/itemrecs/${itemNumber}/${acctNo || ""}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            ClientID: company.clientID,
            ClientSecret: company.clientSecret,
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

  async ({ barcodeId, token }, { getState, rejectWithValue }) => {
    // console.log("Using token for request:", token);
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    try {
      const pageNo = 0;
      const pageSize = 200; // Adjust pageSize if necessary
      const response = await fetch(
        // `https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/itemrecs/search/${barcodeId}/${pageNo}/${pageSize}`,
        `${apiUrl}/itemrecs/search/${barcodeId}/${pageNo}/${pageSize}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            ClientID: company.clientID,
            ClientSecret: company.clientSecret,
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
export const previousOrder = createAsyncThunk(
  "user/previousOrder",
  async ({ acctNo, token }, { getState, rejectWithValue }) => {
    // const url = `https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/webcartshoprecs/${acctNo}`;
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/Webordersrecs/${acctNo}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID,
          Clientsecret: company.clientSecret,
        },
      });

      const text = await response.text(); // Get text to avoid JSON parsing errors initially
      if (!response.ok) {
        console.error("Error fetching previous orders:", text);
        throw new Error(`Could not fetch orders: ${response.status}`);
      }

      const data = JSON.parse(text); // Parse text to JSON manually
      return data;
    } catch (error) {
      console.error("Catch error:", error);
      return rejectWithValue(error.toString());
    }
  }
);

export const previousOrderDetails = createAsyncThunk(
  "user/previousOrderDetails",
  async ({ orderNo, acctNo, token }, { getState, rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/Webordersrecs/${orderNo}/${acctNo}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID,
          Clientsecret: company.clientSecret,
        },
      });

      const text = await response.text(); // Get text to avoid JSON parsing errors initially
      if (!response.ok) {
        console.error("Error fetching previous orders:", text);
        throw new Error(`Could not fetch orders: ${response.status}`);
      }

      const data = JSON.parse(text); // Parse text to JSON manually
      const updatedData = data?.orderDetails.map((item) => {
        return {
          ...item,
          image:
            "https://imxshop.cmxsoftware.com/capitalItemImages/" +
            item.itemNo +
            "/0thn.jpg",
        };
      });
      data.orderDetails = updatedData;
      return data;
    } catch (error) {
      console.error("Catch error:", error);
      return rejectWithValue(error.toString());
    }
  }
);

export const submitOrder = createAsyncThunk(
  "user/submitOrder",
  async (orderDetails, { getState, rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    try {
      const response = await fetch(
        // "https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/Webordersrecs",
        `${apiUrl}/Webordersrecs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user.accessToken}`,
            ClientID: company.clientID,
            ClientSecret: company.clientSecret,
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
      const company = state?.user?.user?.company;
      const apiUrl = company?.apiUrl;
      const response = await fetch(
        // "https://imxshop.cmxsoftware.com/IMXSHOP_API_CAPITAL/api/Webconfigrecs",
        `${apiUrl}/Webconfigrecs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.user.accessToken}`,
            ClientID: company.clientID,
            ClientSecret: company.clientSecret,
          },
        }
      );
      if (!response.ok) {
        let errorMessage = "Failed to fetch company info";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If the response is not JSON or another parsing error occurs, we'll use the default error message
        }
        return rejectWithValue(errorMessage);
      }

      const data = await response.json();
      // Ensure all properties exist to avoid "Cannot read property of null" errors
      console.log(data);
      return {
        addressLine1: data.addressLine1 || "",
        addressLine2: data.addressLine2 || "",
        phone: data.phone || "",
        fax1: data.fax1 || "",
        fax2: data.fax2 || "",
        newCustomerEmail: data.newCustomerEmail || "",
        newOrderEmail: data.newOrderEmail || "",
      };
    } catch (error) {
      // Handle the error case where the error is not from the response
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

export const fetchSwitchAccountRes = createAsyncThunk(
  "user/fetchSwitchAccountRes",
  async ({ token }, { getState, rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/customerrecs/adminSearch`;
    console.log("Fetching switch account details with hardcoded account:", url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID,
          Clientsecret: company.clientSecret,
        },
      });

      const text = await response.text(); // Get text to avoid JSON parsing errors initially
      if (!response.ok) {
        console.error("Error fetching  switch accounts:", text);
        throw new Error(`Could not fetch switch account: ${response.status}`);
      }
      const data = JSON.parse(text); // Parse text to JSON manually
      return data;
    } catch (error) {
      console.error("Catch error:", error);
      return rejectWithValue(error.toString());
    }
  }
);

export const selectSwitchAccount = createAsyncThunk(
  "user/selectSwitchAccount",
  async ({ acctNo, token,navigation }, { getState, dispatch,rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/customerrecs/${acctNo}`;
    console.log("Fetching switch account details with hardcoded account:", url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID,
          Clientsecret: company.clientSecret,
        },
      });

      const text = await response.text(); // Get text to avoid JSON parsing errors initially
      if (!response.ok) {
        console.error("Error select  switch accounts:", text);
        throw new Error(`Could not select switch account: ${response.status}`);
      }
      const data = JSON.parse(text); // Parse text to JSON manually
      const payload ={
        AcctNo: data?.acctNo,
        EmailAddress: state?.user?.user?.emailAddress,
      }
      dispatch(Webloginacctrecs({token: token,payload,navigation}))
      return data;
    } catch (error) {
      console.error("Catch error:", error);
      return rejectWithValue(error.toString());
    }
  }
);

export const Webloginacctrecs = createAsyncThunk(
  "user/Webloginacctrecs",
  async ({ token,payload, navigation }, { getState, rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/Webloginacctrecs`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID,
          Clientsecret: company.clientSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      if (!response.ok) {
        console.error("Error add to cart:", text);
        throw new Error(`Error add to cart: ${response.status}`);
      }
      navigation.navigate("KeyPad");
      // dispatch(getCart({ acctNo, token }));
      return true;
    } catch (error) {
      console.error("Catch error:", error);
      return rejectWithValue(error.toString());
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
        // const customerInfo = action.payload.customers[0];
        const customerInfo = action.payload.companyName;
        const customers = action.payload.customers[0];
        state.user = {
          emailAddress: action.payload.emailAddress,
          lastLogin: action.payload.lastLogin,
          acctNo: customers.acctNo,
          company: customerInfo,
          ...action.payload,
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

      .addCase(previousOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(previousOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.previousOrders = action.payload;
      })
      .addCase(previousOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(previousOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(previousOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.previousOrderDetails = action.payload;
      })
      .addCase(previousOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchSwitchAccountRes.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchSwitchAccountRes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.switchAccountRes = action.payload;
      })
      .addCase(fetchSwitchAccountRes.rejected, (state, action) => {
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
        state.companyInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(submitOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(selectSwitchAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(selectSwitchAccount.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.user = {
          ...state.user,
          acctNo: action.payload.acctNo,
          companyName: action.payload.companyName,
        };
      })
      .addCase(selectSwitchAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { setLogout } = userReducer.actions;
export default userReducer.reducer;
