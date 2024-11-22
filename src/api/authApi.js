import axiosClient from './axiosClient';

const authApi = {
  // sign in
  signIn: (params) => {
    // params.username = params.email;
    // delete params['email'];
    const url = '/auth/login';
    return axiosClient.post(url, params);
  },

  // get current account info
  getCurrentUserInfo: () => {
    const url = '/auth/profile';
    return axiosClient.get(url);
  },

  // sign up
  signUp: (params) => {
    const url = '/auth/register';
    return axiosClient.post(url, params);
  },

  // sign out
  signOut: (params) => {
    const url = '/auth/logout';
    return axiosClient.post(url, params);
  },

  /**
   * Doi mat khau
   * @param {string} oldPassword mat khau cu
   * @param {string} newPassword mat khau moi
   */
  changePassword: (oldPassword, newPassword) => {
    const url = '/auth/change-password';
    return axiosClient.post(url, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  },

  /**
   * Gui yc dat lai mat khau
   * @param {string} email email
   */
  requestResetPassword: (email) => {
    const url = '/auth/send-reset-password';
    return axiosClient.post(url, {
      email: email,
    });
  },

  /**
   * Dat lai mat khau
   * @param {string} email email
   * @param {string} code sha256 ma dat lai mat khau
   * @param {string} newPassword mat khau moi
   * @returns
   */
  resetPassword: (email, code, newPassword) => {
    const url = '/auth/reset-password';
    return axiosClient.post(url, {
      email: email,
      resetPasswordToken: code,
      newPassword: newPassword,
    });
  },

  /**
   * Cap nhat thong tin tai khoan
   * @param {object} params tham so cap nhat
   * @returns
   */
  updateAccount: (params) => {
    const url = '/account/update';
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    return axiosClient.put(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default authApi;
