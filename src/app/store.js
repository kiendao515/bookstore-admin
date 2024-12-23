// Import reducers
import appReducer from './appSlice';
import authReducer from './authSlice';
import categoryReducer from '../modules/Admin/features/Category/categorySlice';
import accountReducer from '../modules/Admin/features/Account/accountSlice';
import bookReducer from "../modules/Admin/features/Book/bookSlice";
import collectionReducer from "../modules/Admin/features/Collection/collectionSlice"
import orderReducer from "../modules/Admin/features/Order/orderSlice"
import revenueReducer from '../modules/Admin/features/Revenue/revenueSlice'
import configReducer from '../modules/Admin/features/WebContent/configSlice'
const { configureStore } = require('@reduxjs/toolkit');

// root reducer
const rootReducer = {
  app: appReducer,
  auth: authReducer,
  category : categoryReducer,
  account : accountReducer,
  book : bookReducer,
  collection : collectionReducer,
  order: orderReducer,
  revenue: revenueReducer,
  config: configReducer
};

// app store
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_DEV_TOOLS == 1 ? true : false,
});

export default store;
