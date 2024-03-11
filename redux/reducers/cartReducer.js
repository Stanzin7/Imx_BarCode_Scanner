import { createSlice } from "@reduxjs/toolkit";
// import { DEFUALT_FONT_SIZE } from "@utils/constants";

const initialState = {
  products: [],
  totalPrice: 0,
};

export const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      // console.log("Adding product:", action.payload);
      const index = state.products.findIndex(
        (item) => item?.itemNo === action.payload.itemNo
      );
      if (index > -1) {
        state.products[index].quantity = state.products[index].quantity + 1;
        // state.products[index].quantity = state.products[index].quantity + 1;
      } else {
        state.products.push(action.payload.item);
      }
    },
    increaseQuanity: (state, action) => {
      const index = state.products.findIndex(
        (item) => item?.itemNo === action.payload.itemNo
      );
      if (index > -1) {
        state.products[index].quantity = state.products[index].quantity + 1;
        // state.products[index].quantity = state.products[index].quantity + 1;
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
  },
});

//will give the all user Redux data from store
export const getCartProducts = (state) => state.entities.cart;

export const gettotalPriceOfProduct = (state) =>
  state.entities.cart.products.reduce(
    (acc, product) => acc + product.sellPriceCase1 * product.quantity,
    0
  );

export const { addProduct, decreaseQuanity, increaseQuanity, deleteProduct } =
  cartReducer.actions;

export default cartReducer.reducer;
