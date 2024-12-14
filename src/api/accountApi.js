import axiosClient from './axiosClient';

const accountApi = {
  getListAccount: (params) => {
    const url = '/accounts';
    return axiosClient.get(url, { params });
  },
  createAccountInfo: (params) => {
    const url = '/customers';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData);
  },
  resetPassword: (params) => {
    const url = `/accounts/pass/reset/${params.id}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData);
  },
  updateAccountInfo: (params) => {
    const url = `/customers/${params.id}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData);
  },
  deleteAccountAndInfo: (params) => {
    const url = '/customers';
    return axiosClient.delete(url, {
      data: {
        account_ids: params,
      },
    });
  },
  createStoreInfo: (params) => {
    const url = '/book-stores';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData);
  },
  updateStoreInfo: (params) => {
    const url = `/book-stores/${params.id}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData);
  },
  deleteAccountAndStoreInfo: (params) => {
    const url = '/book-stores';
    return axiosClient.delete(url, {
      data: {
        account_ids: params,
      },
    });
  },
  getStores:()=>{
    const url = `/book-stores`
    return axiosClient.get(url);
  }
};

export default accountApi;
