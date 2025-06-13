
import { axiosInstance } from './api';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export class CommonApi<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(): Promise<ApiResponse<T[]>> {
    const response = await axiosInstance.get<ApiResponse<T[]>>(this.endpoint);
    return response.data;
  }

  async getOne(id: string | number): Promise<ApiResponse<T>> {
    const response = await axiosInstance.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post<ApiResponse<T>>(this.endpoint, data);
    return response.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await axiosInstance.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string | number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
    return response.data;
  }
}
