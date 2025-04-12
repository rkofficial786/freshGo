import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getOrdersData, proceedToCheckoutApi, successOrder } from "./actions";

export interface CounterState {
  currentOrder: any;
  isOrderProceed: any;
}

const initialState: CounterState = {
  currentOrder: {},
  isOrderProceed: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setInitialState: () => initialState,
    setIsOrderProceed: (state, action) => {
      state.isOrderProceed = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(proceedToCheckoutApi.fulfilled, (state, { payload }) => {
      if (payload.success) {
        state.currentOrder = payload.orderDetails;
      }
    });
    builder.addCase(successOrder.fulfilled, (state, { payload }) => {});
    builder.addCase(getOrdersData.fulfilled, (state, { payload }) => {});
  },
});

export const { setInitialState, setIsOrderProceed } = orderSlice.actions;
export { proceedToCheckoutApi, successOrder, getOrdersData };
export default orderSlice.reducer;
