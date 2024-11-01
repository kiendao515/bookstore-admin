// Import reducers
import appReducer from './appSlice';
import authReducer from './authSlice';
import categoryReducer from '../modules/Admin/features/Category/categorySlice';
import accountReducer from '../modules/Admin/features/Account/accountSlice';
import bookReducer from "../modules/Admin/features/Book/bookSlice"
const { configureStore } = require('@reduxjs/toolkit');

// root reducer
const rootReducer = {
  app: appReducer,
  auth: authReducer,
  category : categoryReducer,
  account : accountReducer,
  book : bookReducer
};

// app store
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_DEV_TOOLS == 1 ? true : false,
});

export default store;
