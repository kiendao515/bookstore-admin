import axios from 'axios';
import axiosClient from './axiosClient';

const reportApi = {
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
  }
};

export default reportApi;