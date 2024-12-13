import axiosClient from './axiosClient';

const offlineOrderApi = {
  getOfflineOrders: (params) => {
    const url = '/offline-orders';
    return axiosClient.get(url, { params });
  },
  getOfflineOrderDetail: (params) => {
    const url = `/offline-orders/${params}`;
    return axiosClient.get(url);
  },
  createOfflineOrder: (body) => {
    const url = `/offline-orders`;
    return axiosClient.post(url, body, null)
  },
  getBookOfflineOrderDetail: (params) => {
    const url = `/offline-orders/book-detail`;
    return axiosClient.get(url, { params });
  },
};

export default offlineOrderApi;
