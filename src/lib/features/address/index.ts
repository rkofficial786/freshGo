import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  AddNewAddress,
  deleteAddress,
  getAllAddress,
  makeDefaultAddress,
  updateAddress,
} from "./actions";

const initialState = {};

export const bannerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // setInitialState: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(getAllAddress.fulfilled, (state, { payload }) => {});
    builder.addCase(AddNewAddress.fulfilled, (state, { payload }) => {});
    builder.addCase(makeDefaultAddress.fulfilled, (state, { payload }) => {});
    builder.addCase(updateAddress.fulfilled, (state, { payload }) => {});
    builder.addCase(deleteAddress.fulfilled, (state, { payload }) => {});
  },
});

export const {} = bannerSlice.actions;
export {
  getAllAddress,
  deleteAddress,
  makeDefaultAddress,
  updateAddress,
  AddNewAddress,
};
export default bannerSlice.reducer;
