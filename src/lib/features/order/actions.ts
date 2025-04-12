import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiConnector } from "@/apis/apiConnector";
import { selectToken } from "@/lib/hooks";

export const proceedToCheckoutApi = createAsyncThunk(
  "/order",

  async (data: any, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector("post", `/api/order`, data, {}, null);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const getOrdersData = createAsyncThunk(
  "/orders-data",

  async (_, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector("get", `/api/order`, null, {}, null);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const successOrder = createAsyncThunk(
  "/orders",

  async (data: any, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector(
        "post",
        `/api/order/${data.id}`,
        data,
        {},
        null
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);
