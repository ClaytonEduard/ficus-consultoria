import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ListFavoriteCompanies from './pages/ListFavoriteCompanies/ListFavoriteCompanies';
import Login from './pages/Login/Login';
import styled from 'styled-components';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  const handleLogin = (data) => {
    console.log("Login data:", data); // Log para verificar os dados recebidos no login
    setIsLoggedIn(true);
    setSessionData(data);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/favoritas" /> : <Login onLogin={handleLogin} />} />
        <Route
          path="/favoritas"
          element={isLoggedIn ? <ListFavoriteCompanies sessionId={sessionData?.sessionId} password={sessionData?.password} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

const MainAppContainer = styled.div`
    display: flex;
    justify-items: center;
`;

export default App;
