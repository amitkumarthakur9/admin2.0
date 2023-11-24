import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';

// Create a new Axios instance with defaults
const axiosInstance = axios.create({
  baseURL: "https://vision-connect.azurewebsites.net/",
});

// Set up a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);

    if (error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname.includes("sign-in")) {
        console.log(error.response.data['errors']);
      } else {
        window.location.reload();
      }
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // You can add any custom headers here, like authorization headers
      },
    };

    const response = await axiosInstance(config);

    console.log('response', response);

    return response.data;
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: endpoint,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // You can add any custom headers here, like authorization headers
      },
    };

    const response = await axiosInstance(config);
    return response.data;
  }

  static async downloadFile({ endpoint, fileName = "file", data }): Promise<void> {
    try {
      const config: AxiosRequestConfig = {
        method: 'POST',
        url: endpoint,
        data: data,
        responseType: 'blob', // Set the response type to 'blob' for file download
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
