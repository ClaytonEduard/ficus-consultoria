import React, { useState, useContext } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styled from "styled-components";

import { useNavigate } from 'react-router-dom';

import { SessionContext } from "../../utils/SessionContext"
import AuthService from '../../auth/AuthService';

const Login = ({ onLoginSuccess }) => {

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const authService = new AuthService();

  const handleLogin = async (e) => {
    e.preventDefault()

    authService.authenticate(userName, password).then(response => {
      if (response) {
        console.log('Autenticação bem-sucedida:', response);
        const { session, passwordHash } = response;
        return authService.getFavoriteCompanies(session, passwordHash);
      }
    }).then(companies => {
      if (companies) {
        console.log('Empresas favoritas:', companies);
      }
    })
      .catch(error => {
        console.error('Erro na autenticação ou ao obter empresas favoritas:', error);
      });
  }


  return (
    <MainContainer>
      <WelcomeText>Bem Vindo</WelcomeText>
      <Form onSubmit={handleLogin}>
        <InputContainer>
          <MyInput className='input' type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Usuário" required />
          <MyInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
        </InputContainer>
        <ButtonContainer>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button content="Entrar" type='submit' />
        </ButtonContainer>
      </Form>
      <ForgotPasswordContainer>
        <ForgotPassword>Esqueci a senha</ForgotPassword>
      </ForgotPasswordContainer>
    </MainContainer>
    // <div>
    //   <h2>Login</h2>
    //   <form onSubmit={handleLogin}>
    //     <div>
    //       <label>Username:</label>
    //       <input
    //         type="text"
    //         value={userName}
    //         onChange={(e) => setUserName(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label>Password:</label>
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     {error && <p style={{ color: 'red' }}>{error}</p>}
    //     <button type="submit">Login</button>
    //   </form>
    // </div>

  );
}



const MyInput = styled.input`
background: rgba(255, 255, 255, 0.15);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
border-radius: 2rem;
width: 80%;
height: 3rem;
padding: 1rem;
border: none;
outline: none;
color: #FFF;
font-size: 1rem;
font-weight: bold;
&:focus {
  display: inline-block;
  box-shadow: 0 0 0 0.2rem #d1ceda;
  backdrop-filter: blur(12rem);
  border-radius: 2rem;
}
&::placeholder {
  color: #b9abe099;
  font-weight: 100;
  font-size: 1rem;
}
`;

const MainContainer = styled.div`
display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  color: #c2c2c284;
  text-transform: uppercase;
  letter-spacing: 0.4rem;
  width: 90%;
  max-width: 1025px;
  min-width: 365px;

  @media only screen and (max-width: 366px) {
    width: 90vw;
    height: auto;
    padding: 1rem;
    h4 {
      font-size: small;
    }
  }

  @media only screen and (min-width: 367px) and (max-width: 768px) {
    width: 80vw;
    height: auto;
    padding: 1.5rem;
  }

  @media only screen and (min-width: 769px) and (max-width: 1024px) {
    width: 70vw;
    height: auto;
  }

  @media only screen and (min-width: 1025px) {
    width: 30vw;
    height: auto;
  }
`;

const WelcomeText = styled.h2`
  margin: 1rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const ButtonContainer = styled.div`
  margin: 1rem 0 2rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ForgotPasswordContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ForgotPassword = styled.h4`
  cursor: pointer;
`;


export default Login;
