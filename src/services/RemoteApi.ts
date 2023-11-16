import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create a new Axios instance with defaults
const axiosInstance = axios.create({
  baseURL: "https://vision-connect.azurewebsites.net/",

});

// Set up a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    if (error.response.status == 305) {
      localStorage.removeItem('token')
      window.location.reload()
    } else {
      return Promise.reject(error);
    }
  }
);

class ApiRequest {
  static async get<T>(endpoint: string): Promise<T> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: endpoint,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
        // You can add any custom headers here, like authorization headers
      },
    };

    const response = await axiosInstance(config);
    return response.data;
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: endpoint,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
        // You can add any custom headers here, like authorization headers
      },
    };

    const response = await axiosInstance(config);
    return response.data;
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: endpoint,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
        // You can add any custom headers here, like authorization headers
      },
    };

    const response = await axiosInstance(config);
    return response.data;
  }
}

export default ApiRequest;
