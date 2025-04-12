import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiConnector } from "@/apis/apiConnector";
import { selectToken } from "@/lib/hooks";

export const login = createAsyncThunk(
  "/auth",

  async (data: any, { rejectWithValue, getState }) => {
    const token = selectToken(getState());

    try {
      const response = await apiConnector("post", "/api/auth", data, {}, null);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "/auth/verifyOtp",

  async (data: any, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector(
        "post",
        "/api/auth/verify-otp",
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

export const getUserDetails = createAsyncThunk(
  "/user",

  async (_, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector("get", "/api/user", null, {}, null);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "/user-update",

  async (data: any, { rejectWithValue, getState }) => {
    const token = selectToken(getState());
    try {
      const response = await apiConnector("patch", "/api/user", data, {}, null);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "/adminauth",

  async (data: any, { rejectWithValue, getState }) => {
    try {
      const response = await apiConnector(
        "post",
        "/api/auth/admin",
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

export const logoutApi = createAsyncThunk(
  "/logout",

  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await apiConnector(
        "post",
        "/api/auth/logout",
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
