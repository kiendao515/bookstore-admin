import axiosClient from './axiosClient';

const authApi = {
  // sign in
  signIn: (params) => {
    // params.username = params.email;
    // delete params['email'];
    const url = '/auth/login-by-pass';
    return axiosClient.post(url, params, {
      headers: {
        apisecret: process.env.REACT_APP_LOGIN_API_SECRET ?? 'UEJ34gtH4TG5345DFG45G3ht1',
      },
    });
  },

  // get current account info
  getCurrentUserInfo: () => {
    const url = '/account/profile';
    return axiosClient.get(url);
  },

  // sign up
  signUp: (params) => {
    const url = '/account/register';
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
    const url = '/account/change-password';
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
    const url = '/account/request-reset-password';
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
    const url = '/account/reset-password';
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
