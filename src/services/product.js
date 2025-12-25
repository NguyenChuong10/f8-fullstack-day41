import {createApi} from "@reduxjs/toolkit/query/react"
import baseQuery from "./baseQuery";
export const productApi = createApi({
    reducerPath : 'productApi',
    baseQuery,
    tagTypes:['Products'],
    endpoints :(builder) => ({
        getProducts: builder.query({
            query:() => "/products",
            providesTags : ['Products'],
        }),
        addProducts: builder.mutation({
            query:(body) => ({
                url:"/products",
                method:"POST",
                body,
            }),
            invalidatesTags: ['Products'],
        }),
        deleteProducts : builder.mutation({
            query:(id) => ({
                url:`/products/${id}`,
                method:"DELETE",
            }),
            invalidatesTags: ['Products'], 
        }),
        updateProducts : builder.mutation({
            query:({id,...patch}) => ({
                url:`/products/${id}`,
                method: "patch",
                body : patch
            }),
            invalidatesTags: ['Products'],
        })

    }),
})

export const {useGetProductsQuery , 
              useAddProductsMutation , 
              useDeleteProductsMutation  , 
              useUpdateProductsMutation} = productApi;