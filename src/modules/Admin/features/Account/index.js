import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import AccountHomePage from './screens/AccountHomePage';

Account.propTypes = {};

function Account(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="account" />} />
      <Route path="home/*" element={<AccountHomePage />} />
    </Routes>
  );
}

export default Account;
