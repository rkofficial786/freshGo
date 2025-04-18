import { configureStore, Store } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import { combineReducers } from "redux";
import LoadSlice from "./features/loading";
import AuthSlice from "./features/auth";
import cartSlice from "./features/cart";
// import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "./customStorage";
import orderSlice from "./features/order";
import productSlice from "./features/products";
import miscSlice from "./features/misc";
// Define the persist config
const persistConfig = {
  key: "freshGo",
  storage,

  whitelist: ["cart", "auth",  "order", "category"],
};

// Combine your reducers
const rootReducer = combineReducers({
  auth: AuthSlice,
  load: LoadSlice,
  cart: cartSlice,
  order: orderSlice,
  misc: miscSlice,
  product: productSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
