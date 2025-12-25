// import {fetchBaseQuery} from "@reduxjs/toolkit/query/react"

// const baseQuery = fetchBaseQuery({
//     baseUrl:'https://api01.f8team.dev/api',
// })

import httpRequest from "../utils/httpRequest";

const baseQuery = async (args, {signal, dispatch, getState}, extraOptions) => {
    console.log("🔵 API Request:", args);

    const isObject = typeof args === "object";
    const config = {
        url: isObject ? args.url : args,
        method: isObject ? args.method : "GET",
    };
    
    if (isObject && args.body) {
        config.data = args.body;
    }

    try {
        const data = await httpRequest(config);
        console.log(" API Response:", data);
        return {data};
    } catch (error) {
        console.error("API Error:", error);
        console.error("Error Response:", error.response?.data);
        
        // Trả về error với format chuẩn
        return {
            error: {
                status: error.response?.status || 500,
                data: error.response?.data || {message: error.message},
            }
        };
    }
};

export default baseQuery;