import axios from 'axios';
import axiosClient from './axiosClient';
import store from 'app/store';

const revenueApi = {
  getListReport: async (from, to) => {
    const url = `/reports?from=${from}&to=${to}`;
    return axiosClient.get(url);
  },
  getListTopCategory: async(from, to) => {
    const url = `/reports/category?from=${from}&to=${to}`;
    return axiosClient.get(url);
  },
  getListTopBuyer: (from, to) => {
    const url = `/reports/buyer?from=${from}&to=${to}`;
    return axiosClient.get(url)
  },
  getRevenue:(from,to)=>{
    const url = `/reports/revenue?from=${from}&to=${to}`;
    return axiosClient.get(url)
  },
  getStoreRevenue:(params)=>{
    const url = `/book-stores/statistic`
    return axiosClient.get(url, { params });
  },
  getDetailBookRevenue:(storeId, bookId)=>{
    const url = `/book-stores/statistic/detail?book_id=${bookId}&store_id=${storeId}`
    return axiosClient.get(url);
  },
  confirmStoreRevenue:(storeId, ids)=>{
    const url = `/book-stores/statistic/confirm?store_id=${storeId}`
    return axiosClient.post(url,ids);
  }
};

export default revenueApi;