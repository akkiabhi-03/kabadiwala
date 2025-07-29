import { AppApi } from "./AppApi.jsx";

export const AdminApi = AppApi.injectEndpoints({
  reducerPath: 'AppApi',
  endpoints: (builder) => ({
    // Create a new admin user
    adminSignUp: builder.mutation({
      query: ({ name, password, passKey, aadharNo, email, phone, token, }) => ({
        url: `/admin/signUp`,
        method: 'POST',
        body: { name, password, passKey, aadharNo, email, phone, token, },
      }),
      
    }),

    //admin Log in
    adminLogIn: builder.mutation({
      query: ({ phone, password }) => ({
        url: `/admin/login`,
        method: 'POST',
        body: { phone, password },
        credentials: "include",
      }),
      invalidatesTags: ["admin"],
    }),

    //admin Log out
    adminLogOut: builder.mutation({
      query: () => ({
        url: `/admin/logout`,
        method: 'POST',
        credentials: 'include',
      }),
    }),

    // Get current admin data
    getAdminUser: builder.query({
      query: () => ({
        url: `/admin/details`,
        method:'GET',
        credentials: 'include',
      }),
      providesTags:["admin"],
    }),
    
    // change admin's Password
    changeAdminPassword: builder.mutation({
      query: ( { oldPassword ,newPassword} ) => ({
        url: `/admin/changepassword`,
        method: 'PATCH',
        body: { oldPassword ,newPassword},
        credentials: 'include',
      }),
    }),
    
    // Reset admin's password
    forgotAdminPassword: builder.mutation({
      query: ({ phone, password, token }) => ({
        url: `/admin/forgotpassword`,
        method: 'POST',
        body: { phone, password, token },
        credentials: "include",
      })

    }),
    
    //update admin's Contact number
    updateAdminContact: builder.mutation({
        query: ({ oldContact, newContact , token }) => ({
            url: `/admin/update-contact`,
            method: "PATCH",
            body: { oldContact, newContact , token },
            credentials: 'include',
        }),
    }),

    // admin orders booking for user
    adminOrder: builder.mutation({
        query: ({ items, userInfo }) => ({
            url: `/admin/admin-order`,
            method: "POST",
            body: { items, userInfo },
            credentials: 'include',
        }),
    }),

    // admin edit users order
    adminEditOrder: builder.mutation({
        query: ({ items, orderId, isSold , status }) => ({
            url: `/admin/admin-orderUpdate`,
            method: "PATCH",
            body: { items, orderId, isSold , status },
            credentials: 'include',
        }),
    }),
    
  }),
});

export const {
  useAdminSignUpMutation,
  useAdminLogInMutation,
  useAdminLogOutMutation,
  useChangeAdminPasswordMutation,
  useForgotAdminPasswordMutation,
  useUpdateAdminContactMutation,
  useLazyGetAdminUserQuery,
  useAdminEditOrderMutation,
  useAdminOrderMutation,
} = AdminApi;
