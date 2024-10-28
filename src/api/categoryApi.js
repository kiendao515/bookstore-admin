import axiosClient from './axiosClient';

const categoryApi = {
  getListCategory: (params) => {
    const url = '/categories';
    return axiosClient.get(url, { params });
  },
  createCategory: (params) => {
    const url = '/categories';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData);
  },
  updateCategory: (params) => {
    const url = `/categories/${params.id}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData);
  },
  deleteCategory: (params) => {
    const url = `/categories/${params.id}`;
    const formData = new FormData();
    return axiosClient.delete(url, formData)
  },
};

export default categoryApi;
