import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import moment from "moment";
import { Platform, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Toast } from "native-base";

// Create a new Axios instance with defaults
const axiosInstance = axios.create({
    baseURL: process.env.API_ENDPOINT,
    withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add custom logic here before the request is sent, e.g., adding authentication tokens
        // console.log("Request sent:", config);
        return config;
    },
    (error) => {
        // Handle request error
        console.error("Error in request:", error);
        return Promise.reject(error);
    }
);

// Set up a response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // console.log("Response:", response);
        return response;
    },
    async (error: any) => {
        // const { showToast } = useToastContext();
        Toast.closeAll();
        if (error?.response?.status === 401) {
            // if (Platform.OS == "web") {
            // router
            if (
                error?.response.config?.url?.includes("/login") ||
                error?.response.config?.url?.includes("/dashboard")
            ) {
                // console.log();
            } else {
                if (Platform.OS == "web") {
                    localStorage.removeItem("token");
                } else {
                    AsyncStorage.removeItem("token");
                }
                window.location.reload();
                // console.log(error);
            }
            // }
        } else if (error.response && error.response.data instanceof Blob) {
            // try {
            const errorText = await error.response.data.text(); // Convert blob to text
            // Optionally, you can try to parse it as JSON if the server sends JSON errors
            const errorJson = JSON.parse(errorText);
            console.error("Parsed error JSON:", errorJson);
            console.error("concoleJSON:");

            // Display the errorJson in a NativeBase toast message
            Toast.show({
                title: "Server Error",
                description: errorJson.message || "Something went wrong",
                bg: "red.500", // Set background color to red
                status: "error",
                duration: 4000,
                placement: "top",
            });
            // return errorJson;
            return Promise.reject(errorJson);
            // } catch (parseError) {
            //     console.error("Error parsing blob:", parseError);
            //     // return Promise.reject(); // If parsing fails, return raw text
            // }
        } else {
            // const errorText = await error.response.data;
            // const errorJson = JSON.parse(errorText);
            Toast.show({
                title: "Server Error",
                description:
                    error.response.data.errors[0].message ||
                    "Something went wrong",
                bg: "red.500", // Set background color to red
                status: "error",
                duration: 4000,
                placement: "top",
            });
            // console.error("firsterror");
            // console.error(error.response);

            console.error(error);
            return error.response;
        }
        // console.error("seconderror");
        // console.error(error);
        // console.error(error.response);
        return error.response;
    }
);

class ApiRequest {
    static async get<T>(endpoint: string): Promise<T> {
        const config: AxiosRequestConfig = {
            method: "GET",
            url: endpoint,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                // You can add any custom headers here, like authorization headers
            },
        };

        const response = await axiosInstance(config);
        return response?.data;
    }

    static async post<T>(
        endpoint: string,
        data?: any,
        cookieToken?: string
    ): Promise<T> {
        // const config: AxiosRequestConfig = {
        //     method: "POST",
        //     url: endpoint,
        //     data: JSON.stringify(data),
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        //         // You can add any custom headers here, like authorization headers
        //     },
        // };

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        };

        // Conditionally add the Cookie header if cookieToken is provided
        if (cookieToken) {
            console.log("header");
            console.log(cookieToken);
            headers["Cookie"] = cookieToken;
            headers["onboardToken"] = cookieToken;
        }

        const config: AxiosRequestConfig = {
            method: "POST",
            url: endpoint,
            data: JSON.stringify(data),
            headers: headers,
            withCredentials: true, // Ensure cookies are sent
        };
        // console.log('post token', await AsyncStorage.getItem("token"));

        try {
            const response = await axiosInstance(config);
            // console.log('response', response);
            return response?.data;
        } catch (error) {
            console.error("Error in POST request", error);
            throw error;
        }

        // const response = await axiosInstance(config);

        // // console.log('response', response);

        // return response?.data;
    }

    // Function to set a cookie via Axios

    static async postWithFormData<T>(endpoint: string, data?: any): Promise<T> {
        const config: AxiosRequestConfig = {
            method: "POST",
            url: endpoint,
            data: data,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                // You can add any custom headers here, like authorization headers
            },
        };

        // console.log('post token', await AsyncStorage.getItem("token"));

        const response = await axiosInstance(config);

        // console.log('response', response);

        return response?.data;
    }

    static async put<T>(endpoint: string, data: any): Promise<T> {
        const config: AxiosRequestConfig = {
            method: "PUT",
            url: endpoint,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                // You can add any custom headers here, like authorization headers
            },
        };

        const response = await axiosInstance(config);
        return response?.data;
    }

    static async patch<T>(endpoint: string, data: any): Promise<T> {
        const config: AxiosRequestConfig = {
            method: "PATCH",
            url: endpoint,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                // You can add any custom headers here, like authorization headers
            },
        };

        const response: any = await axiosInstance(config);
        // console.log("patchresponse" + JSON.stringify(response))
        // console.error("patchresponse" + response)
        // console.log("patchresponse" + response)
        return response?.data;
    }

    static async downloadFile({
        endpoint,
        fileName = "file",
        data,
    }): Promise<void> {
        try {
            const config: AxiosRequestConfig = {
                method: "POST",
                url: endpoint,
                data: data,
                responseType: "blob", // Set the response type to 'blob' for file download
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        "token"
                    )}`,
                },
            };

            const response = await axiosInstance(config);

            // Create a temporary URL to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `${fileName}-${moment(new Date()).valueOf()}.csv`
            ); // Set the file name here

            // Simulate a click to trigger the download
            document.body.appendChild(link);
            link.click();

            // Clean up: remove the link and revoke the URL object
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download Error:", error);
            throw new Error("Failed to download file");
        }
    }

    static async getDownloadFile({
        endpoint,
        fileName = "file",
    }): Promise<void> {
        try {
            const config: AxiosRequestConfig = {
                method: "GET", // Change method to GET
                url: endpoint,
                responseType: "blob", // Set the response type to 'blob' for file download
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        "token"
                    )}`,
                },
            };

            const response = await axiosInstance(config);

            // Create a temporary URL to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `${fileName}-${moment(new Date()).valueOf()}.pdf`
            ); // Set the file name here

            // Simulate a click to trigger the download
            document.body.appendChild(link);
            link.click();

            // Clean up: remove the link and revoke the URL object
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download Error:", error);
            throw new Error("Failed to download file");
        }
    }

    static async downloadPdf({
        endpoint,
        fileName = "file",
        data,
    }): Promise<void> {
        try {
            const config: AxiosRequestConfig = {
                method: "POST",
                url: endpoint,
                data: data,
                responseType: "blob", // Set the response type to 'blob' for file download
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        "token"
                    )}`,
                },
            };

            const response = await axiosInstance(config);

            // Create a temporary URL to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `${fileName}-${moment(new Date()).valueOf()}.pdf`
            ); // Set the file name here

            // Simulate a click to trigger the download
            document.body.appendChild(link);
            link.click();

            // Clean up: remove the link and revoke the URL object
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download Error:", error);
            throw new Error("Failed to download file");
        }
    }
}

export default ApiRequest;
