import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

AppToast.propTypes = {};

function AppToast(props) {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
    />
  );
}

export default AppToast;
