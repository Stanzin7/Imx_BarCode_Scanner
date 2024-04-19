import { createSlice } from "@reduxjs/toolkit";
import { submitOrder } from "./userReducer";
// import { DEFUALT_FONT_SIZE } from "@utils/constants";

const initialState = {
  products: [],
  totalPrice: 0,
  soundEnabled: true,
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
    clearCart: (state) => {
      state.products = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitOrder.fulfilled, (state) => {
      state.products = [];
      state.totalPrice = 0;
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
