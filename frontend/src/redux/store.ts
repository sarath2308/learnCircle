import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./slice/currentUserSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import signupReducer from "./slice/signupSlice";

const persistConfig = {
  key: "signup",
  storage,
};

const persistedSignupReducer = persistReducer(persistConfig, signupReducer);

export const store = configureStore({
  reducer: {
    signup: persistedSignupReducer,
    currentUser: currentUserReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
