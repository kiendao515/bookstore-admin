import { createAsyncThunk } from "@reduxjs/toolkit";
import offlineOrderApi from "api/offlineOrderApi";


export const thunkGetListOfflineOrder = createAsyncThunk('offlineOrder/list', async (params, thunkApi) => {
    const res = await offlineOrderApi.getOfflineOrders(params);
    return res;
})

const offlineOrderSlice = createSlice({
    name: 'offlineOrder',
    initialState: {
        offlineOrder: [],
        isGettingOfflineOrderList: false,
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
        builder.addCase(thunkGetListOfflineOrder.pending, (state, action) => {
            state.isGettingOfflineOrderList = true;
        });
        builder.addCase(thunkGetListOfflineOrder.rejected, (state, action) => {
            state.isGettingOfflineOrderList = false;
        });
        builder.addCase(thunkGetListOfflineOrder.fulfilled, (state, action) => {
            state.isGettingOfflineOrderList = false;
            const { success, data, total_elements, total_pages, page } = action.payload;
            if (success == true) {
                state.offlineOrder = data;
                state.pagination = {
                    ...state.pagination,
                    total: total_elements,
                    count: total_pages,
                    currentPage: page + 1,
                };
            }
        });
    },
});
const { reducer, actions } = offlineOrderSlice;
export const { setPaginationPerPage } = actions;
export default reducer;