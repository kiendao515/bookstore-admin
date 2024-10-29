import accountApi from 'api/accountApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListAccount = createAsyncThunk('account/list', async (params, thunkApi) => {
  const res = await accountApi.getListAccount(params);
  return res;
});

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: [],
    isGettingAccount: false,
    pagination: { perPage: Global.gDefaultPagination },
  },
  reducers: {
    setPaginationPerPage: (state, action) => {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          perPage: action.payload,
        },
      };
    },
  },
  extraReducers: (builder) => {
    // get list employee
    builder.addCase(thunkGetListAccount.pending, (state, action) => {
      state.isGettingAccount = true;
    });
    builder.addCase(thunkGetListAccount.rejected, (state, action) => {
      state.isGettingAccount = false;
    });
    builder.addCase(thunkGetListAccount.fulfilled, (state, action) => {
      state.isGettingAccount = false;
      const { success, data, total_elements, size, total_page,page } = action.payload;
      if (success == true) {
        state.account = data;
        state.pagination = {
          ...state.pagination,
          total: total_elements,
          count: size,
          currentPage: page + 1,
        };
      }
    });
  },
});
const { reducer, actions } = accountSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
