import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllProducts, getProductsById, resizableProducts } from "./action";

export interface CounterState {}

const initialState: CounterState = {};

export const productSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(resizableProducts.fulfilled, (state, { payload }) => {});
    builder.addCase(getAllProducts.fulfilled, (state, { payload }) => {});
    builder.addCase(getProductsById.fulfilled, (state, { payload }) => {});
  },
});

export const {} = productSlice.actions;
export { resizableProducts, getAllProducts, getProductsById };
export default productSlice.reducer;
