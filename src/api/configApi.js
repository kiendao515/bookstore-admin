
import axiosClient from "./axiosClient";

const configApi = {
    getListConfig: async () => {
        const url = `/web-contents`;
        return axiosClient.get(url);
    },
    updateConfig: async (params) => {
        const url = `/web-contents/${params.id}`;
        const formData = new FormData();
        for (const key in params) {
          formData.append(key, params[key]);
        }
    
        return axiosClient.put(url, formData);
    }
};

export default configApi;