
import Global from 'general/utils/Global';
import orderApi from 'api/orderApi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// MARK ---- thunks ---
export const thunkGetListOrder = createAsyncThunk('order/list', async (params, thunkApi) => {
  const res = await orderApi.getListOrder(params);
  return res;
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: [],
    isGettingOrder: false,
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
    builder.addCase(thunkGetListOrder.pending, (state, action) => {
      state.isGettingOrder = true;
    });
    builder.addCase(thunkGetListOrder.rejected, (state, action) => {
      state.isGettingOrder = false;
    });
    builder.addCase(thunkGetListOrder.fulfilled, (state, action) => {
      state.isGettingOrder = false;
      const { success, data, total_elements, size, page } = action.payload;
      if (success == true) {
        state.order =data ;
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
const { reducer, actions } = orderSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
