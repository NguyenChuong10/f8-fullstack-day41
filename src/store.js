
import {configureStore} from "@reduxjs/toolkit";
import productReducer from  "@/features/product/productSlice";
import { productApi } from "./services/product";

const store = configureStore({
    reducer: {
        product: productReducer,
        [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                // Bỏ qua kiểm tra serializable cho RTK Query
                ignoredActions: [
                    'productApi/executeMutation/rejected',
                    'productApi/executeQuery/fulfilled',
                ],
                ignoredPaths: [
                    'productApi.mutations',
                    'productApi.queries',
                ],
            },
        }).concat(productApi.middleware)
})

window.store = store;
console.log(store);
export default store;

