import axiosClient from './axiosClient';

const collectionApi = {
  getListCollection: (params) => {
    const url = '/collections';
    return axiosClient.get(url, { params });
  },
  createCollection: (params) => {
    const url = '/collections';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData);
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
