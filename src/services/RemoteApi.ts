import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Create a new Axios instance with defaults
const axiosInstance = axios.create({
  baseURL: "https://vision-connect.azurewebsites.net/",
});

// Set up a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response
    } else {
      return
    }
  },
  (error: AxiosError) => {
    console.error('API Error:', error.toJSON());

    if (error.response.status === 401) {
      if (Platform.OS == "web") {
        localStorage.removeItem('token');
      } else {
        AsyncStorage.removeItem("token");
      }

      // if (Platform.OS == "web") {
      // router
      if (error.request['_url'].includes("/login")) {
        // console.log(error.response.data['errors']);
      } else {
        window.location.reload();
      }
      // }
    }

    return error.response;
  }
);

class ApiRequest {
  static async get<T>(endpoint: string): Promise<T> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: endpoint,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        // You can add any custom headers here, like authorization headers
      },
    };

    const response = await axiosInstance(config);
    return response?.data;
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: endpoint,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
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
      method: 'PUT',
      url: endpoint,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        // You can add any custom headers here, like authorization headers
      },
    };

    const response = await axiosInstance(config);
    return response?.data;
  }

  static async downloadFile({ endpoint, fileName = "file", data }): Promise<void> {
    try {
      const config: AxiosRequestConfig = {
        method: 'POST',
        url: endpoint,
        data: data,
        responseType: 'blob', // Set the response type to 'blob' for file download
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      };

      const response = await axiosInstance(config);

      // Create a temporary URL to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}-${moment(new Date()).valueOf()}.csv`); // Set the file name here

      // Simulate a click to trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the link and revoke the URL object
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download Error:', error);
      throw new Error('Failed to download file');
    }
  }
}

export default ApiRequest;
