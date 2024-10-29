import categoryApi from 'api/categoryApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListCategory = createAsyncThunk('employee/list', async (params, thunkApi) => {
  const res = await categoryApi.getListCategory(params);
  return res;
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    category: [],
    isGettingCategory: false,
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
    builder.addCase(thunkGetListCategory.pending, (state, action) => {
      state.isGettingCategory = true;
    });
    builder.addCase(thunkGetListCategory.rejected, (state, action) => {
      state.isGettingCategory = false;
    });
    builder.addCase(thunkGetListCategory.fulfilled, (state, action) => {
      state.isGettingCategory = false;
      const { success, data, total_elements, size, page } = action.payload;
      if (success == true) {
        state.category =data ;
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
const { reducer, actions } = categorySlice;
export const { setPaginationPerPage } = actions;
export default reducer;
