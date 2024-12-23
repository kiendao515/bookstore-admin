
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import collectionApi from 'api/collectionApi';
import configApi from 'api/configApi';
import revenueApi from 'api/revenueApi';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListConfig = createAsyncThunk('config/list', async (params, thunkApi) => {
  const res = await configApi.getListConfig(params);
  return res;
});

const configSlice = createSlice({
  name: 'config',
  initialState: {
    config: [],
    isGettingConfig: false,
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
    builder.addCase(thunkGetListConfig.pending, (state, action) => {
      state.isGettingConfig = true;
    });
    builder.addCase(thunkGetListConfig.rejected, (state, action) => {
      state.isGettingConfig = false;
    });
    builder.addCase(thunkGetListConfig.fulfilled, (state, action) => {
      state.isGettingConfig = false;
      const { success , data, total_elements, size, page } = action.payload;
      if (success == true) {
        state.config =data ;
        state.pagination = {
          ...state.pagination,
          total: total_elements,
          count: size,
          currentPage: page + 1,
        };
      }else{
        state.config = [];
      }
    });
  },
});
const { reducer, actions } = configSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
