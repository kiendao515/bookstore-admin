import axios from 'axios';
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
  updateBookInventory: (params) => {
    const url = '/inventories';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData);
  },
  updateBookInfo: (params) => {
    const url = `/books/${params.id}`;
    return axiosClient.put(url, params);
  },
  addBookInfoAndInventory: (params) => {
    const url = process.env.REACT_APP_API_URL+'/inventories/create';
    return axios.post(url, params);
  },
  getBookInfoByISBN:(params)=>{
    const url = `https://crawl-book-info.onrender.com/api/book/${params}`;
    return axios.get(url)
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