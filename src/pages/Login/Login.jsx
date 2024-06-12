import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../auth/AuthService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styled from "styled-components";

const Login = ({ onLogin }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const authService = new AuthService();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'userName') {
      setUserName(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const sessionData = await authService.authenticateUser(userName, password);
      onLogin(sessionData)
      navigate('/favoritas');
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error.message);
    }
  };

  return (
    <MainContainer>
      <WelcomeText>Bem Vindo</WelcomeText>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <input type='text' placeholder='Nome' name="userName" value={userName} onChange={handleInputChange} required />
          <input type="password" placeholder='Senha' name="password" value={password} onChange={handleInputChange} required />
        </InputContainer>
        <ButtonContainer>
          <Button content="Entrar" type='submit' />
        </ButtonContainer>
      </Form>
      <ForgotPasswordContainer>
        <ForgotPassword>Esqueci a senha</ForgotPassword>
      </ForgotPasswordContainer>
    </MainContainer>
  );
};

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
  color: #ffffff;
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
