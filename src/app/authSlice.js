import authApi from 'api/authApi';
import { updateAxiosApiKey } from 'api/axiosClient';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import ToastHelper from 'general/helpers/ToastHelper';
import UserHelper from 'general/helpers/UserHelper';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

// MARK: --- Thunks ---
// Sign in
export const thunkSignIn = createAsyncThunk('auth/signIn', async (params, thunkAPI) => {
  const res = await authApi.signIn(params);
  return res;
});

// Get current user info
export const thunkGetCurrentUserInfo = createAsyncThunk(
  'auth/getCurrentUserInfo',
  async (params, thunkAPI) => {
    const res = await authApi.getCurrentUserInfo(params);
    return res;
  }
);

// Sign out
export const thunkSignOut = createAsyncThunk('auth/signOut', async function (params, thunkAPI) {
  const res = await authApi.signOut(params);
  return res;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isSigningIn: false,
    current: {},
  },
  reducers: {
    signOut: (state, action) => {
      state.error = '';
      state.current = {};
    },
  },
  extraReducers: {
    // Sign in
    [thunkSignIn.pending]: (state, action) => {
      state.isSigningIn = true;
    },
    [thunkSignIn.rejected]: (state, action) => {
      state.isSigningIn = false;
    },
    [thunkSignIn.fulfilled]: (state, action) => {
      state.isSigningIn = false;
      const payload = action.payload;
      const { data, errors } = payload;
      // const data = action.payload;
      if (!!errors) {
        ToastHelper.showError(errors[0]?.message);
      } else {
        state.current = data;
        const { apiSecret } = data;
        if (apiSecret) {
          localStorage.setItem(PreferenceKeys.apiKey, apiSecret);
          updateAxiosApiKey(apiSecret);
        }
      }
    },

    // Get current user info
    [thunkGetCurrentUserInfo.pending]: (state, action) => {
      state.isSigningIn = true;
    },
    [thunkGetCurrentUserInfo.rejected]: (state, action) => {
      state.isSigningIn = false;
    },
    [thunkGetCurrentUserInfo.fulfilled]: (state, action) => {
      state.isSigningIn = false;
      const data = action.payload;
      const { result, account } = data;
      if (result === 'success' && account) {
        state.current = account;

        if (account.accessToken) {
          localStorage.setItem(PreferenceKeys.accessToken, account.accessToken);
        }
        if (account.expirationDateToken) {
          localStorage.setItem(PreferenceKeys.accessTokenExpired, account.expirationDateToken);
        }
      }
    },

    // Sign out
    [thunkSignOut.fulfilled]: (state, action) => {
      const { data, errors } = action.payload;
      if (data) {
        state.current = {};
      }
      UserHelper.signOut();
      // window.location.href = '/sign-in';
    },
  },
});

const { reducer, actions } = authSlice;
export const { signOut } = actions;
export default reducer;
