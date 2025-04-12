import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getInstaPosts, getInstaVideo } from "./actions";


export interface CounterState {}

const initialState: CounterState = {};

export const instaSlice = createSlice({
  name: "category",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getInstaPosts.fulfilled, (state, { payload }) => {});
    builder.addCase(getInstaVideo.fulfilled, (state, { payload }) => {});
  },
});

export const {} = instaSlice.actions;
export { getInstaPosts ,getInstaVideo};
export default instaSlice.reducer;
