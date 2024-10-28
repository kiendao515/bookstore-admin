import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import EmployeeHomePage from './screens/CategoryHomePage';

Account.propTypes = {};

function Account(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home/*" element={<AccountHomePage />} />
    </Routes>
  );
}

export default Account;
