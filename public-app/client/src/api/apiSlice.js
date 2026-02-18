import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token || localStorage.getItem('token');
      headers.set('ngrok-skip-browser-warning', '69420');
      headers.set('Content-Type', 'application/json');
      if (token) {
        headers.set('access-token', token);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // --- Transaction APIs ---
    getTransactions: builder.query({
      query: ({ store, page, limit,startDate,endDate }) =>
        `/customer/allTransition?store=${store}&page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}`,
    }),
    getSearchTransactions: builder.query({
      query: ({ searchTerm, store }) =>
        `/points/searchApiTransition?search_value=${searchTerm}&store=${store}`,
    }),
    // --- Customer APIs ---
    getCustomer: builder.query({
      query: ({ store, page, limit,startDate,endDate }) =>
        `/customer/customerName?store=${store}&page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}`,
    }),
    getSearchCustomer: builder.query({
      query: ({ searchTerm, store }) =>
        `/points/searchApiCustomer?search_value=${searchTerm}&store=${store}`,
    }),
    // ---------coupon---------
    getCoupon: builder.query({
        query: ({ store, page, limit}) =>
          `/coupon/list?store=${store}&page=${page}&limit=${limit}`,
      }),
      getSearchCoupon: builder.query({
        query: ({ store, page ,search}) =>
          `/coupon/couponSearch?store=${store}&page=${page}&search_value=${search}&couponstatus=Active`,
      }),
      // used coupon 
      getUsedCoupon: builder.query({
        query: ({ store, page, limit}) =>
          `/coupon/usedcouponlist?store=${store}&page=${page}&limit=${limit}`,
      }),
      getUseSearchCoupon: builder.query({
        query: ({ store, page ,search}) =>
          `/coupon/couponSearch?store=${store}&page=${page}&search_value=${search}&couponstatus=Used`,
      }),
      // expier coupon
      getExpireCoupon: builder.query({
        query: ({ store, page, limit}) =>
          `/coupon/expiredcouponlist?store=${store}&page=${page}&limit=${limit}`,
      }),
  }),
});

// ✅ Export all the hooks here
export const {
  useGetTransactionsQuery,
  useGetSearchTransactionsQuery,
  useGetCustomerQuery,
  useGetSearchCustomerQuery,
  useLazyGetSearchCustomerQuery, 
  useGetCouponQuery,
  useGetSearchCouponQuery,
  useGetUsedCouponQuery,
  useGetUseSearchCouponQuery,
  useGetExpireCouponQuery 
} = transactionApi;
