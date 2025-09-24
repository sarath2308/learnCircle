import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./slice/currentUserSlice";

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
