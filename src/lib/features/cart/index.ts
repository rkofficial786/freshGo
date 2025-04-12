import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCartItems, getCouponById, getVisibleCoupons } from "./action";

interface Size {
  id: string;
  price: number;
  stock: number;
  type: string;
}

interface CartItem {
  id: string | number;
  size: Size;
  count: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setInitialState: () => initialState,
    addToCart: (
      state,
      action: PayloadAction<{
        id: string | number;
        size: Size;
        quantity: number;
      }>
    ) => {
      const { id, size, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.size.id === size.id
      );
      if (existingItem) {
        existingItem.count += 1;
      } else {
        state.items.push({ id, size, count: quantity });
      }
    },
    increaseCount: (
      state,
      action: PayloadAction<{ id: string | number; sizeId: string }>
    ) => {
      const { id, sizeId } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size.id === sizeId
      );
      if (item) {
        item.count += 1;
      }
    },
    decreaseCount: (
      state,
      action: PayloadAction<{ id: string | number; sizeId: string }>
    ) => {
      const { id, sizeId } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size.id === sizeId
      );
      if (item) {
        if (item.count > 1) {
          item.count -= 1;
        } else {
          state.items = state.items.filter(
            (i) => !(i.id === id && i.size.id === sizeId)
          );
        }
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: string | number; sizeId: any }>
    ) => {
      const { id, sizeId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size.id === sizeId)
      );
    },
    emptyCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
    setTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload;
    },
    updateCartItemPrice: (
      state,
      action: PayloadAction<{
        id: string | number;
        sizeId: string;
        newPrice: number;
      }>
    ) => {
      const { id, sizeId, newPrice } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size.id === sizeId
      );
      if (item) {
        item.size.price = newPrice;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCartItems.fulfilled, (state, { payload }) => {});
    builder.addCase(getVisibleCoupons.fulfilled, (state, { payload }) => {});
    builder.addCase(getCouponById.fulfilled, (state, { payload }) => {});
  },
});

export const {
  setInitialState,
  addToCart,
  increaseCount,
  decreaseCount,
  removeFromCart,
  emptyCart,
  setTotalAmount,
  updateCartItemPrice,
} = cartSlice.actions;
export { getCartItems, getCouponById, getVisibleCoupons };
export default cartSlice.reducer;
