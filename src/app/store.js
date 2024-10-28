// Import reducers
import appReducer from './appSlice';
import authReducer from './authSlice';
import categoryReducer from '../modules/Saymee/features/Category/categorySlice';
import accountReducer from '../modules/Saymee/features/Account/accountSlice';
const { configureStore } = require('@reduxjs/toolkit');

// root reducer
const rootReducer = {
  app: appReducer,
  auth: authReducer,
  category : categoryReducer,
  account : accountReducer
};

// app store
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_DEV_TOOLS == 1 ? true : false,
});

export default store;
