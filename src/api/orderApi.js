import axiosClient from './axiosClient';

const collectionApi = {
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
};

export default collectionApi;
