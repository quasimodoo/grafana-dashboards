import axios from 'axios';
import { showErrorNotification } from './notification-manager';


class ApiRequest {
  axiosInstance: any;
  constructor(params) {
    this.axiosInstance = axios.create({
      ...params,
    });
  }

  async post<T, B>(path: string, body: {}): Promise<void | T> {
    // @ts-ignore
    return this.axiosInstance
      .post<T>(path, body)
      .then((response): T => response.data)
      .catch((e): void => {
        showErrorNotification({ message: e.response.data.message });
        throw e;
      });
  }
}

export const apiRequest = new ApiRequest();
export const apiRequestQAN = new ApiRequest({ baseURL: '/v0/qan' });
export const apiRequestManagement = new ApiRequest({ baseURL: '/v1/management' });
export const apiRequestInventory = new ApiRequest({ baseURL: '/v1/inventory' });
export const apiRequestSettings = new ApiRequest({ baseURL: '/v1/Settings' });
