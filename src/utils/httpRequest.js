import axios from "axios";


const httpRequest = axios.create({
    baseURL:"https://api01.f8team.dev/api"
});

httpRequest.interceptors.response.use((response) => {
    return response.data;
});


export default httpRequest;