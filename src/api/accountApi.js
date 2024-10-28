import axiosClient from './axiosClient';

const accountApi = {
  getListAccount: (params) => {
    const url = '/accounts';
    return axiosClient.get(url, { params });
  },
  createCreate: (params) => {
    const url = '/accounts';
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.post(url, formData);
  },
  updateEmployee: (params) => {
    const url = `/accounts/${params.accountId}`;
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }

    return axiosClient.put(url, formData);
  },
  deleteEmployee: (params) => {
    const url = '/accounts';
    return axiosClient.delete(url, {
      data: {
        accountIds: params,
      },
    });
  },
};

export default accountApi;
