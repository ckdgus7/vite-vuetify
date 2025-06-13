
import { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';

export const setupInterceptors = (instance: AxiosInstance) => {
  // Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      // 토큰이 필요한 경우
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        // 토큰 만료 처리
        // 리프레시 토큰으로 새로운 액세스 토큰 발급 로직
      }
      return Promise.reject(error);
    }
  );
};
