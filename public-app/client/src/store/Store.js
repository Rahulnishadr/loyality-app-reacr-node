
import { configureStore } from '@reduxjs/toolkit';
import { transactionApi } from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionApi.middleware),
});
