import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { submitOrder } from "./userReducer";
// import { DEFUALT_FONT_SIZE } from "@utils/constants";

const initialState = {
  products: [],
  totalPrice: 0,
  soundEnabled: true,
  isLoading: false,
  error: null,
};

export const addToCart = createAsyncThunk(
  "user/addToCart",
  async ({ acctNo, token,  itemNo }, { getState, rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/webcartshoprecs/${acctNo}/CART`;

    console.log("get url", url);
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
        console.error("Error add to cart:", text);
        throw new Error(`Error add to cart: ${response.status}`);
      }
      console.log("itemNo:", itemNo);
      let data = JSON.parse(text); // Parse text to JSON manually
      const filterData = data?.find((item) => {
        console.log("item.itemNo", item.itemNo, itemNo);
        return item.itemNo === itemNo;
      });
      return filterData;
    } catch (error) {
      console.error("Catch error:", error);
      return rejectWithValue(error.toString());
    }
  }
);

// export const getCartItem = createAsyncThunk(
//   "user/getCartItem",
//   async ({ token }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const company = state?.user?.user?.company;
//     const apiUrl = company?.apiUrl;
//     const url = `${apiUrl}/Webconfigrecs`;

//     console.log("get url", url);
//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Clientid: company.clientID,
//           Clientsecret: company.clientSecret,
//         },
//       });

//       const text = await response.text(); // Get text to avoid JSON parsing errors initially
//       if (!response.ok) {
//         console.error("Error fetching cart items:", text);
//         throw new Error(`Could not cart items: ${response.status}`);
//       }
//       const data = JSON.parse(text); // Parse text to JSON manually
//       console.log("data:", data.length, data);
//       return data;
//     } catch (error) {
//       console.error("Catch error:", error);
//       return rejectWithValue(error.toString());
//     }
//   }
// );

export const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
      console.log(state.soundEnabled);
    },
    // addProduct: (state, action) => {
    //   console.log("products", state.products);
    //   const index = state.products.findIndex(
    //     (item) => item?.itemNo === action.payload.itemNo
    //   );
    //   if (index > -1) {
    //     state.products[index].quantity += 1;
    //     const itemToUpdate = { ...state.products[index] };
    //     state.products.splice(index, 1);
    //     state.products.unshift(itemToUpdate);
    //   } else {
    //     const newProduct = { ...action.payload.item, quantity: 1 };
    //     state.products.unshift(newProduct);
    //   }
    // },
    increaseQuanity: (state, action) => {
      const index = state.products.findIndex(
        (item) => item?.itemNo === action.payload.itemNo
      );
      if (index > -1) {
        state.products[index].quantity = state.products[index].quantity + 1;
      }
    },
    decreaseQuanity: (state, action) => {
      const index = state.products.findIndex(
        (item) => item?.itemNo === action.payload.itemNo
      );
      if (index > -1) {
        state.products[index].quantity = state.products[index].quantity - 1;
        // state.products[index].quantity = state.products[index].quantity + 1;
      }
    },
    deleteProduct: (state, action) => {
      const index = state.products.findIndex(
        (item) => item?.itemNo === action.payload.itemNo
      );
      if (index > -1) {
        state.products.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.fulfilled, (state) => {
        state.products = [];
        state.totalPrice = 0;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.scanSuccess = false;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scanSuccess = true;
        // state.products = []

        console.log("payload==<", action.payload);
        const index = state.products.findIndex(
          (item) => item?.itemNo === action.payload.itemNo
        );

        console.log("index===>", index);
        if (index > -1) {
          state.products[index].quantity += 1;
          const itemToUpdate = { ...state.products[index] };
          state.products.splice(index, 1);
          state.products.unshift(itemToUpdate);
        } else {
          const newProduct = { ...action.payload.item, quantity: 1 };
          state.products.unshift(newProduct);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.scanSuccess = false;
        state.error = action.payload;
      });
  },
});

//will give the all user Redux data from store
export const getCartProducts = (state) => state.entities.cart;

export const gettotalPriceOfProduct = (state) =>
  state.entities.cart.products.reduce(
    (acc, product) => acc + product.sellPriceCase1 * product.quantity,
    0
  );

export const getTotalEstimatedWeight = (state) =>
  state.entities.cart.products.reduce(
    (totalWeight, product) =>
      totalWeight + (product.netLbwght || 0) * product.quantity,
    0
  );
export const getRoundedTotalEstimatedWeight = (state) => {
  const weight = getTotalEstimatedWeight(state); // Use the existing selector
  return +parseFloat(weight).toFixed(2); // Rounds to two decimal places and converts back to number
};

export const {
  addProduct,
  decreaseQuanity,
  increaseQuanity,
  deleteProduct,
  clearCart,
  toggleSound,
} = cartReducer.actions;

export default cartReducer.reducer;
