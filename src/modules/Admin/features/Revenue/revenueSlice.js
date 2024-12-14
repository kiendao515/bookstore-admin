
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import collectionApi from 'api/collectionApi';
import revenueApi from 'api/revenueApi';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListRevenue = createAsyncThunk('revenue/list', async (params, thunkApi) => {
  const res = await revenueApi.getStoreRevenue(params);
  return res;
});

const revenueSlice = createSlice({
  name: 'revenue',
  initialState: {
    revenue: [],
    isGettingRevenue: false,
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
    builder.addCase(thunkGetListRevenue.pending, (state, action) => {
      state.isGettingRevenue = true;
    });
    builder.addCase(thunkGetListRevenue.rejected, (state, action) => {
      state.isGettingRevenue = false;
    });
    builder.addCase(thunkGetListRevenue.fulfilled, (state, action) => {
      state.isGettingRevenue = false;
      const { result , data, total_elements, size, page } = action.payload;
      if (result == true) {
        state.revenue =data ;
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
const { reducer, actions } = revenueSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
