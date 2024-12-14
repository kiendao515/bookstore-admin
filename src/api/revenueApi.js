import axios from 'axios';
import axiosClient from './axiosClient';

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
  }
};

export default revenueApi;