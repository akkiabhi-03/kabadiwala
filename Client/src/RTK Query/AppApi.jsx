import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const AppApi = createApi({
    reducerPath: "AppApi",
    refetchOnFocus: true, // need listener in store
    refetchOnReconnect: true,  // need listener in store
    baseQuery: fetchBaseQuery({ baseUrl: "https://kabadiwala.onrender.com" }),
    credentials: 'include',
    endpoints: (builder) => ({
        
        //get all materials rate
        getMaterialRate: builder.query({
            query: () => ({
                url:`/order/prices`,
                method:'GET',
            }),
            providesTags: ['price'],
        }),

        // new order
        newOrder: builder.mutation({
            query: ({ items, isSold ,area }) => ({
                url:`/order/newOrder`,
                method:'POST',
                body:{ items, isSold ,area },
                credentials:'include',
            }),
            invalidatesTags: ['order'],
            
        }),

        // get all my orders
        getMyOrder: builder.query({
            query: () => ({
                url: `/order/getOrder`,
                credentials: 'include',
            }),
            providesTags: ['order'],
        }),

        // edit current order
        editOrder: builder.mutation({
            query: ( { items, orderId, status, isSold , area } ) => ({
                url: `/order/editOrder`,
                method: 'PATCH',
                body: { items, orderId, isSold ,status, area },
                credentials: 'include',
            }),
            invalidatesTags: ['order'],
        }),

        //update status of order by admin
        statusUpdate: builder.mutation({
            query: ({ orderId, status, area }) => ({
                url: `/order/status-update`,
                method: 'PATCH',
                body: { orderId, status, area },
                credentials: "include",
            }),
            invalidatesTags: ['order'],
        }),

        // update each materials price
        materialPriceUpdate: builder.mutation({
            query: ({ area, pricePerKg }) => ({
                url: `/order/price-update`,
                method: 'PATCH',
                body: { area, pricePerKg },
                credentials: "include",
            }),
            invalidatesTags: ['price'],
        }),

        //updating total purchase for each material
        updateTotalPurchase: builder.mutation({
            query: ({ area, totalPurchase }) => ({
                url: `/order/update-totalPurchase`,
                method: 'PATCH',
                body: { area, totalPurchase },
                credentials: "include",
            }),
            invalidatesTags: ['app-data'],
        }),

        //get total puchase & price per kg
        getAppDataAdmin: builder.query({
            query: (area) => ({
                url:`/order/app-data`,
                method:'GET',
                params: {area},
                credentials:'include',
            }),
            providesTags: ['app-data']
        }),

        //create new center
        createCenter: builder.mutation({
            query: ({ area, totalPurchase, pricePerKg }) => ({
                url:'/order/create-appData',
                method: 'POST',
                body: { area, totalPurchase, pricePerKg },
                credentials: 'include',
            }),

        }),

        //get-userOrders
        getUserOrder: builder.query({
            query: (area) => ({
                url:`/order/get-userOrder`,
                method:'GET',
                params: {area},
                credentials:'include',
            }),
            providesTags: ['user-order']
        }),

        //delete-userOrder
        deleteUserOrder: builder.mutation({
            query: (  orderIds ) => ({
                url:'/order/delete-userOrder',
                method: 'DELETE',
                body: { orderIds },
                credentials: 'include',
            }),
            invalidatesTags: ['user-order'],
        }),

    }),
});

export const {
  // ✅ Lazy GET Queries
  useLazyGetMaterialRateQuery,
  useLazyGetMyOrderQuery,
  useLazyGetAppDataAdminQuery,
  useLazyGetUserOrderQuery,

  // ✅ Mutations
  useNewOrderMutation,
  useEditOrderMutation,
  useStatusUpdateMutation,
  useMaterialPriceUpdateMutation,
  useUpdateTotalPurchaseMutation,
  useCreateCenterMutation,
  useDeleteUserOrderMutation,
} = AppApi;
