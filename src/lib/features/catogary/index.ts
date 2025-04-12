import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllCategories, getCategoryProducts } from "./actions";

// Define the shape of your state
export interface CategoryState {
  search: string;
  categories: any[];
}

// Initial state
const initialState: CategoryState = {
  search: "",
  categories: [],
};

// Define the slice
export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Reducer for setting main and sub categories, keeping the existing value if not provided

    setSearchQuery: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCategories.fulfilled, (state, { payload }) => {
      const mainCategories = payload.categories
        .map((item) => ({
          id: item._id,
          name: item.name,
          image: item.img,
          parentCategory: item.parentCategory,
          subCategories: item.childCategory.map((child) => ({
            id: child._id,
            name: child.name,
            image: child.img,
          })),
        }))
        .filter((item) => item.parentCategory.length == 0);

      state.categories = mainCategories;
      // Handle payload from getAllCategories if needed
    });
    builder.addCase(getCategoryProducts.fulfilled, (state, { payload }) => {
      // Handle payload from getAllCategories if needed
    });
  },
});

// Export the action
export const { setSearchQuery } = categorySlice.actions;
export { getAllCategories, getCategoryProducts };
export default categorySlice.reducer;
