// import { getProducts } from "@/services/product/product"
import {/*createAsyncThunk*/  createSlice} from "@reduxjs/toolkit"

const initialState = {
    product: [],  
    value : 0 ,  
}

// export const fetchProducts = createAsyncThunk(
//     'product/fetchProducts',
//      async() => {
//         const response = await getProducts();
//         return response.data.items;
//      }, 
// )

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        Increase(state){
            state.value ++;
        },
        Decrease(state){
            state.value --;
        },
        // extraReducers:(Builder) => {
        //     Builder.addCase(fetchProducts.fulfilled , (state , action) => {
        //         state.product = action.payload;

        //     })
        // }
    } 
}); 

export const {Increase , Decrease } = productSlice.actions
export default productSlice.reducer