import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer from './slice/currentUserSlice'

import tempUserReducer from './slice/tempSlice'

export const store = configureStore({
  reducer: {
    tempUser:tempUserReducer,
    currentUser:currentUserReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
