import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { submitOrder } from "./userReducer";
import ShowToast from "../../hooks/ShowToast";
// import { DEFUALT_FONT_SIZE } from "@utils/constants";

// GET API
export const getCart = createAsyncThunk(
  "user/getCart",
  async ({ acctNo, token }, { getState, rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/webcartshoprecs/${acctNo}/CART`;
    console.log("Get URL====>", url, token);
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
        console.error("Error fetching cart:", text);
        throw new Error(`Error fetching cart: ${response.status}`);
      }

      console.log("Get Cart Response====>", text);
      return JSON.parse(text); // Parse text to JSON manually
    } catch (error) {
      console.error("Catch error:", error);
      return rejectWithValue(error.toString());
    }
  }
);

export const addToCartFirst = createAsyncThunk(
  "user/addToCart",
  async (
    { acctNo, token, payload },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/webcartshoprecs`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID, // Corrected to "ClientId"
          Clientsecret: company.clientSecret, // Corrected to "ClientSecret"
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      if (!response.ok) {
        console.error("Error add to cart:", text);
        ShowToast("Error adding item to cart", "error");
        throw new Error(`Error add to cart: ${response.status}`);
      }
      dispatch(getCart({ acctNo, token }));
      ShowToast("Item added to cart", "success");
      return true;
    } catch (error) {
      console.error("Catch error:", error);
      ShowToast("Error adding item to cart", "error");
      return rejectWithValue(error.toString());
    }
  }
);

// DELETE API
export const deleteCart = createAsyncThunk(
  "user/deleteCart",
  async (
    { acctNo, itemNo, token },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/webcartshoprecs/${acctNo}/${itemNo}/CART`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID,
          Clientsecret: company.clientSecret,
        },
      });

      const text = await response.text();
      if (!response.ok) {
        console.error("Error delete cart:", text);
        ShowToast("Error deleting item from cart", "error");
        throw new Error(`Error delete cart: ${response.status}`);
      }
      dispatch(getCart({ acctNo, token }));
      ShowToast("Item deleted from cart", "success");
      return true;
    } catch (error) {
      console.error("Catch error:", error);
      ShowToast("Error deleting item from cart", "error");
      return rejectWithValue(error.toString());
    }
  }
);

// PUT API
export const updateCart = createAsyncThunk(
  "user/updateCart",
  async (
    { acctNo, token, payload },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/webcartshoprecs`;
    try {
      const response = await fetch(url, {
        method: "PUT",
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
        console.error("Error update cart:", text);
        ShowToast("Error updating cart", "error");
        throw new Error(`Error update cart: ${response.status}`);
      }
      dispatch(getCart({ acctNo, token }));
      ShowToast("Cart updated successfully.", "success");
      return true;
    } catch (error) {
      console.error("Catch error:", error);
      ShowToast("Error updating cart", "error");
      return rejectWithValue(error.toString());
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "user/clearCart",
  async ({ acctNo, token }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const company = state?.user?.user?.company;
    const apiUrl = company?.apiUrl;
    const url = `${apiUrl}/webcartshoprecs/Clear/${acctNo}/CART`;

    console.log("Clearing cart for acctNo:", acctNo, "url:", url, token);
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Clientid: company.clientID,
          Clientsecret: company.clientSecret,
          "Content-Type": "application/json",
        },
      });
      const text = await response.text();
      if (!response.ok) {
        console.error("Error clear cart:", text);
        ShowToast("Error deleting cart items", "error");
        throw new Error(`Error clear cart: ${response.status}`);
      }
      dispatch(getCart({ acctNo, token }));
      // ShowToast("Cart item deleted successfully.", "success");
      return true;
    } catch (error) {
      console.error("Catch error:", error);
      ShowToast("Error deleting cart items", "error");
      return rejectWithValue(error.toString());
    }
  }
);


const initialState = {
  products: [],
  totalPrice: 0,
  soundEnabled: true,
  isLoading: false,
  error: null,
};

export const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
      console.log(state.soundEnabled);
    },
    addProduct: (state, action) => {
      const index = state.products.findIndex(
        (item) => item?.itemNo === action.payload.itemNo
      );
      if (index > -1) {
        state.products[index].quantity += 1;
        const itemToUpdate = { ...state.products[index] };
        state.products.splice(index, 1);
        state.products.unshift(itemToUpdate);
      } else {
        const newProduct = { ...action.payload.item, quantity: 1 };
        state.products.unshift(newProduct);
      }
    },
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
    // clearCart: (state) => {
    //   state.products = [];
    //   state.totalPrice = 0;
    //   state.soundEnabled = true;
    //   state.isLoading = false;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.fulfilled, (state) => {
        state.products = [];
        state.totalPrice = 0;
      })
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const sortedProducts = action.payload.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        state.products = sortedProducts;
        // state.products = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToCartFirst.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartFirst.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

//will give the all user Redux data from store
export const getCartProducts = (state) => state.entities.cart;

export const gettotalPriceOfProduct = (state) =>
  state.entities.cart.products.reduce(
    (acc, product) => acc + product.item.sellPriceCase1 * product.qty,
    0
  );

export const getTotalEstimatedWeight = (state) =>
  state.entities.cart.products.reduce(
    (totalWeight, product) =>
      totalWeight + (product.item.netLbwght || 0) * product.qty,
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
  // clearCart,
  toggleSound,
} = cartReducer.actions;

export default cartReducer.reducer;
