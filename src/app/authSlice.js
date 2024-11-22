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
    user: {
      id: "",
      email: '',
      full_name: '',
      role: "",
      date_of_birth: '',
      phone_number: '',
    },
    isAuth: false,
  },
  reducers: {
    signOut: (state, action) => {
      state.error = '';
      state.user = {
        id: "",
        email: '',
        full_name: '',
        role: "",
        date_of_birth: '',
        phone_number: '',
      },
        state.isAuth = false;
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
      const { data, result, reason } = payload;
      if (!result) {
        ToastHelper.showError(reason);
      } else {
        console.log("data", data, state.user)
        state.user = data.user;
        console.log("statue", state.user)
        const { token } = data;
        if (token) {
          localStorage.setItem(PreferenceKeys.apiKey, token);
          updateAxiosApiKey(token);
        }
      }
    },

    // Get current user info
    [thunkGetCurrentUserInfo.pending]: (state, action) => {
      state.isAuth = true;
    },
    [thunkGetCurrentUserInfo.rejected]: (state, action) => {
      state.isAuth = false;
    },
    [thunkGetCurrentUserInfo.fulfilled]: (state, action) => {
      state.isAuth = true;
      const res = action.payload;
      const { result, data } = res;
      if (result && data) {
        state.user = data;
        if (data.token) {
          localStorage.setItem(PreferenceKeys.accessToken, data.token);
        }
      }
    },

    // Sign out
    [thunkSignOut.fulfilled]: (state, action) => {
      const { data, errors } = action.payload;
      if (data) {
        state.user = {
          id: "",
          email: '',
          full_name: '',
          role: "",
          date_of_birth: '',
          phone_number: '',
        };
        state.isAuth = false;
      }
      UserHelper.signOut();
      // window.location.href = '/sign-in';
    },
  },
});

const { reducer, actions } = authSlice;
export const { signOut } = actions;
export default reducer;
