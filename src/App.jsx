import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';

import ListFavoriteCompanies from './pages/ListFavoriteCompanies/ListFavoriteCompanies';
import Login from './pages/Login/Login';
import styled from 'styled-components';
import { SessionProvider } from './utils/SessionContext'

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/favoritas" Component={ListFavoriteCompanies} />
          <Route path="/" Component={Login} />
        </Routes>
      </Router>
    </SessionProvider>
  );
};

const MainAppContainer = styled.div`
    display: flex;
    justify-items: center;
`;

export default App;
