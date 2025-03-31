import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import categoryReducer from "./reducers/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
  },
});
