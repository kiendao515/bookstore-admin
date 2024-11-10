
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import collectionApi from 'api/collectionApi';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListCollection = createAsyncThunk('collection/list', async (params, thunkApi) => {
  const res = await collectionApi.getListCollection(params);
  return res;
});

const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    collection: [],
    isGettingCollection: false,
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
    builder.addCase(thunkGetListCollection.pending, (state, action) => {
      state.isGettingCollection = true;
    });
    builder.addCase(thunkGetListCollection.rejected, (state, action) => {
      state.isGettingCollection = false;
    });
    builder.addCase(thunkGetListCollection.fulfilled, (state, action) => {
      state.isGettingCollection = false;
      const { success, data, total_elements, size, page } = action.payload;
      if (success == true) {
        state.collection =data ;
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
const { reducer, actions } = collectionSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
