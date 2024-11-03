import axiosClient from './axiosClient';

const bookApi = {
  getListBookInfo: (params) => {
    const url = '/books';
    return axiosClient.get(url, { params });
  },
  getListBookInventoryInfo: (storeId,bookId) => {
    const url = '/inventories?bookId='+bookId+"&storeId="+storeId;
    return axiosClient.get(url, null);
  },
  createAccountInfo: (params) => {
    const url = '/customers';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData);
  },
  updateBookInfo: (params) => {
    const url = `/books/${params.id}`;
    console.log("book request",params);
    
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
  getStores: (params) => {
    const url = '/book-stores';
    return axiosClient.get(url, {params});
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
};

export default bookApi;