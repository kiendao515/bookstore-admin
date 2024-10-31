
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookApi from 'api/bookApi';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListBook = createAsyncThunk('book/list', async (params, thunkApi) => {
  const res = await bookApi.getListBookInfo(params);
  return res;
});

const bookSlice = createSlice({
  name: 'book',
  initialState: {
    book: [],
    isGettingBookList: false,
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
    // get list order
    builder.addCase(thunkGetListBook.pending, (state, action) => {
      state.isGettingBookList = true;
    });
    builder.addCase(thunkGetListBook.rejected, (state, action) => {
      state.isGettingBookList = false;
    });
    builder.addCase(thunkGetListBook.fulfilled, (state, action) => {
      state.isGettingBookList = false;
      const { success, data, total, count, page } = action.payload;
      if (success == true) {
        state.book = data;
        state.pagination = {
          ...state.pagination,
          total: total,
          count: count,
          currentPage: page + 1,
        };
      }
    });
  },
});
const { reducer, actions } = bookSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
