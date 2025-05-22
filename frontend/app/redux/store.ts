import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/app/redux/slices/uiSlice";
import apiReducer from "@/app/redux/slices/apiSlice"


const store = configureStore({
  reducer: {
    ui: uiReducer,
    api: apiReducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
