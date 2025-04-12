import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiConnector } from "@/apis/apiConnector";
import { selectToken } from "@/lib/hooks";

export const getAllCategories = createAsyncThunk(
  "/categories",

  async (_, { rejectWithValue, getState }) => {
    const token = selectToken(getState());

    try {
      const response = await apiConnector(
        "get",
        `/api/category`,
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

export const getCategoryProducts = createAsyncThunk(
  "/api/categoryProducts",

  async (_, { rejectWithValue, getState }) => {
    const token = selectToken(getState());

    try {
      const response = await apiConnector(
        "get",
        `/api/categoryProducts`,
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
