import { configureStore } from '@reduxjs/toolkit';
import { learnerAuthApi } from './api/learner/learnerAuth';
import { ProfAuthApi } from './api/profesional/profAuth';

export const store = configureStore({
  reducer: {
    [learnerAuthApi.reducerPath]: learnerAuthApi.reducer,
    [ProfAuthApi.reducerPath]:ProfAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(learnerAuthApi.middleware)
  .concat(ProfAuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
