import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

const categorySlce = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
    },
  },
});

export const { setCategories, clearCategories } = categorySlce.actions;

export default categorySlce.reducer;