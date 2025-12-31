import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./slice/currentUserSlice";
import signupReducer from "./slice/signupSlice";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // sessionStorage
import chapterReducer from "./slice/chapterSlice";
import courseDetailsReducer from "./slice/courseDetails";

const signupPersistConfig = {
  key: "signup",
  storage: storageSession,
};

const persistedSignupReducer = persistReducer(signupPersistConfig, signupReducer);


const currentUserPersistConfig = {
  key: "currentUser",
  storage: storageSession,
};

const persistedCurrentUserReducer = persistReducer(currentUserPersistConfig, currentUserReducer);

export const store = configureStore({
  reducer: {
    signup: persistedSignupReducer,
    currentUser: persistedCurrentUserReducer,
    chapter: chapterReducer,
    courseDetails: courseDetailsReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
