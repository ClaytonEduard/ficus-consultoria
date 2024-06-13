import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';

import ListFavoriteCompanies from './pages/ListFavoriteCompanies/ListFavoriteCompanies';
import Login from './pages/Login/Login';
import styled from 'styled-components';
const App = () => {
  const [sessionData, setSessionData] = useState(null);
  const [favoriteCompanies, setFavoriteCompanies] = useState([]);

  const handleLoginSuccess = (data) => {
    setSessionData(data);
  };

  const handleFetchFavorites = (companies) => {
    setFavoriteCompanies(companies);
  };
  return (

    <div>

      {!sessionData && (
        <Login onLoginSuccess={handleLoginSuccess} onFetchFavorites={handleFetchFavorites} />
      )}
      {favoriteCompanies.length > 0 && (
        <ListFavoriteCompanies companies={favoriteCompanies} />
      )}
    </div>
  );
};

const MainAppContainer = styled.div`
    display: flex;
    justify-items: center;
`;

export default App;
