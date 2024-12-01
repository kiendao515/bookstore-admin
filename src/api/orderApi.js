import axios from 'axios';
import axiosClient from './axiosClient';

const orderApi = {
  getListOrder: (params) => {
    const url = '/orders';
    return axiosClient.get(url, { params });
  },
  getOrderDetail: (params) => {
    const url = `/orders/${params}`;
    return axiosClient.get(url);
  },
  getPickingAddress: () => {
    const url = `/shipping/address/pick`;
    return axiosClient.get(url)
  },
  getTraceOrder: (id) => {
    const url = `https://web.giaohangtietkiem.vn/api/v1/package/package-detail`;
    return axios.get(url + `?alias=` + id, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GHTK_WEB_TOKEN}`
      }
    });
  },
  createGHTKOrder: (body) => {
    const url = `/shipping/order/create`;
    return axiosClient.post(url, body, null)
  },
  printOrder: (id) => {
    const url = `/shipping/label?orderId=` + id;
    return axiosClient.get(url);
  },
  updateOrderStatus: (id, body) => {
    const url = `/orders/${id}`;
    return axiosClient.put(url, body)
  }
};

export default orderApi;
