import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import BookHomeScreen from './screens/BookHomeScreen';

Book.propTypes = {};

function Book(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home/*" element={<BookHomeScreen />} />
    </Routes>
  );
}

export default Book;
