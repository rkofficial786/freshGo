import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCartItems, getCouponById, getVisibleCoupons } from "./action";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Array of { productId, quantity }
    products: [], // Full product details fetched from API
    summary: {
      totalItems: 0,
      totalQuantity: 0,
      cartTotal: 0,
      mrpTotal: 0,
      discount: 0,
      deliveryFee: 0,
      tax: 0,
    },
    loading: false,
    error: null,
    availableCoupons: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        // Update quantity if item already exists
        existingItem.quantity += quantity;
      } else {
        // Add new item
        state.items.push({ productId, quantity });
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        } else {
          // Update quantity
          existingItem.quantity = quantity;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.products = [];
      state.summary = {
        totalItems: 0,
        totalQuantity: 0,
        cartTotal: 0,
        mrpTotal: 0,
        discount: 0,
        deliveryFee: 0,
        tax: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;

        // Update cart summary if provided
        if (action.payload.cartSummary) {
          state.summary = action.payload.cartSummary;
        } else {
          // Calculate summary if not provided by API
          const products = action.payload.products || [];
          const totalQuantity = state.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          // Calculate totals
          let cartTotal = 0;
          let mrpTotal = 0;

          products.forEach((product) => {
            const cartItem = state.items.find(
              (item) => item.productId === product._id
            );
            if (cartItem) {
              cartTotal += product.price * cartItem.quantity;
              mrpTotal += (product.mrp || product.price) * cartItem.quantity;
            }
          });

          state.summary = {
            totalItems: products.length,
            totalQuantity,
            cartTotal,
            mrpTotal,
            discount: mrpTotal - cartTotal,
            deliveryFee: cartTotal < 499 ? 50 : 0, // Free delivery above 499
            tax: Math.round(cartTotal * 0.05), // 5% tax
          };
        }
      })
      .addCase(getCartItems.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.msg || "Failed to fetch cart products";
      })
      .addCase(getVisibleCoupons.fulfilled, (state, { payload }) => {
        console.log(payload, "payload copuns");

        if (payload.success) {
          state.availableCoupons = payload.coupons;
        }
      })
      .addCase(getCouponById.fulfilled, (state, { payload }) => {});
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export { getCartItems, getVisibleCoupons, getCouponById };

export default cartSlice.reducer;
