import axios from "axios";
import useAppNotifications from "@/hooks/useAppNotifications";
import {IAuthResponse} from "@/types/IAuth";

const httpInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    }
});

export type OptionsParams = {
    params?: {
        [key: string]: string | number | undefined;
    }
}

// Add a request interceptor
httpInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const authenticationLocalStorage = window.localStorage.getItem("authentication");

    if (typeof window !== "undefined" && authenticationLocalStorage) {
        const authentication: IAuthResponse = JSON.parse(authenticationLocalStorage);
        config.headers.Authorization = "Bearer " + authentication.accessToken;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
httpInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // if (response.data && response.data.data) {
    //     return response;
    // }
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
        // const {showNotification} = useAppNotifications();
        return Promise.reject(error);
    }
}
);
export default httpInstance;
