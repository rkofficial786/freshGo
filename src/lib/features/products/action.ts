import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiConnector } from "@/apis/apiConnector";
import { selectToken } from "@/lib/hooks";

export const resizableProducts = createAsyncThunk(
  "/zoom",

  async (_, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector(
        "get",
        `/api/zoomData`,
        null,
        {},
        null
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "/products",

  async (data: any, { rejectWithValue, getState }) => {
    const token = selectToken(getState());

    try {
      const response = await apiConnector(
        "get",
        `/api/products?${data}`,
        null,
        {},
        null
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const getProductsById = createAsyncThunk(
  "/products/:id",

  async (data: any, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector(
        "get",
        `/api/products/${data}`,
        null,
        {},
        null
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);