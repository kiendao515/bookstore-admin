import axios from 'axios';
import axiosClient from './axiosClient';

const orderApi = {
  getListOrder: (params) => {
    const url = '/orders';
    return axiosClient.get(url, { params });
  },
  updateCollection: (params) => {
    const url = `/collections/${params.id}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData);
  },
  deleteCollection: (params) => {
    const url = `/collections/${params.id}`;
    const formData = new FormData();
    return axiosClient.delete(url, formData)
  },
  getTraceOrder: (id) => {
    const url = `https://web.giaohangtietkiem.vn/api/v1/package/package-detail`;
    return axios.get(url + `?alias=` + id, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GHTK_WEB_TOKEN}`
      }
    });
  }
};

export default orderApi;
