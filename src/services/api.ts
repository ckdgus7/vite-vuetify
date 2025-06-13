import axios, { type AxiosInstance } from 'axios';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

export const axiosInstance: AxiosInstance = createAxiosInstance();
