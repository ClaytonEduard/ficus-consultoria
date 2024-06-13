import React, { useState, useContext } from 'react';
import Button from '../../components/Button';
import styled from "styled-components";
import axios from 'axios'

//import crypto from 'crypto'
//import { crypto, enc } from 'crypto-js/sha256'
const crypto = require('crypto-js');
// import AuthService from '../../auth/AuthService';
// const axios = require('axios');  // Importa a biblioteca axios para fazer requisições HTTP
//const crypto = require('crypto'); // Importa a biblioteca crypto para usar funções criptográficas
const crc32 = require('crc').crc32;

const Login = ({ onLoginSuccess, onFetchFavorites }) => {

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  // Função para obter o nonce do servidor
  async function getServerNonce(userName) {
    // Define a URL com o nome do usuário
    const url = `http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa/auth?UserName=${userName}`;
    // Faz uma requisição GET para a URL
    const response = await axios.get(url);
    // Retorna o nonce do servidor presente na resposta
    return response.data.result;
  }

  // Função para gerar o nonce do cliente
  function getClientNonce() {
    // Obtém a data e hora atual em formato ISO
    const currentTime = new Date().toISOString();
    // Gera o hash SHA256 da data e hora atual
    //return crypto.createHash('sha256').update(currentTime).digest('hex');
    return crypto.SHA256(currentTime).toString(crypto.enc.Hex);
  }

  // Função para codificar a senha
  function encodePassword(userName, serverNonce, clientNonce, password) {
    const salt = 'salt'; // Define o salt
    // Combina o salt com a senha
    const saltedPassword = salt + password;
    // Gera o hash SHA256 da combinação salt + senha
    //const hash1 = crypto.createHash('sha256').update(saltedPassword).digest('hex');
    const hash1 = crypto.SHA256(saltedPassword).toString(crypto.enc.Hex)

    // Combina várias strings conforme especificado
    const combinedString = `retaguarda_prospect/${userName}${serverNonce}${clientNonce}${userName}${hash1}`;

    // Gera o hash SHA256 da string combinada
    // return crypto.createHash('sha256').update(combinedString).digest('hex');
    return crypto.SHA256(combinedString).toString(crypto.enc.Hex);
  }

  // Função para gerar o hash da senha
  function hashPassword(password) {
    const salt = 'salt'; // Define o salt
    // Combina o salt com a senha
    const saltedPassword = salt + password;
    // Gera e retorna o hash SHA256 da combinação salt + senha
    // return crypto.createHash('sha256').update(saltedPassword).digest('hex');
    return crypto.SHA256(saltedPassword).toString(crypto.enc.Hex);
  }

  // Função para autenticar o usuário
  async function authenticate(userName, password) {
    try {
      // Obtém o nonce do servidor
      const serverNonce = await getServerNonce(userName);
      console.log("Server nonce: " + serverNonce)
      // Gera o nonce do cliente
      const clientNonce = getClientNonce();
      console.log("Cliente nonce: " + clientNonce)
      // Codifica a senha usando os nonces e o nome do usuário
      const encodedPassword = encodePassword(userName, serverNonce, clientNonce, password);
      console.log("Enconder Pass: " + encodedPassword)
      // Define a URL para autenticação com os parâmetros necessários
      const url = `http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa/auth?UserName=${userName}&Password=${encodedPassword}&ClientNonce=${clientNonce}`;
      // Faz a requisição GET para a URL de autenticação
      const response = await axios.get(url);
      // Retorna o resultado da autenticação e o hash da senha
      return {
        session: response.data.result,
        passwordHash: hashPassword(password)
      };
    } catch (error) {
      // Trata erros de requisição HTTP
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  // Função para obter o ID da sessão
  function getSessionId(session) {
    // Divide a string da sessão e retorna a parte antes do '+'
    return session.split('+')[0];
  }

  // Função para obter a chave privada
  function getPrivateKey(session, passwordHash) {
    // Calcula o CRC32 do valor da sessão
    const sessionCRC = crc32(session);
    // Calcula e retorna o CRC32 do hash da senha usando o valor da sessão CRC como valor inicial
    return crc32(passwordHash, sessionCRC);
  }

  // Função para obter a timestamp em hexadecimal
  function getTimestampHex() {
    // Obtém o timestamp atual em milissegundos
    let timestamp = Date.now();
    // Converte o timestamp para uma string hexadecimal
    let hexTimestamp = timestamp.toString(16);
    // Retorna os últimos 8 dígitos da string hexadecimal
    return hexTimestamp.slice(-8);
  }

  // Função para calcular a assinatura da sessão
  function getSessionSignature(path, privateKey, timestampHex) {
    // Calcula o CRC32 da timestamp hexadecimal usando a chave privada como valor inicial
    const timestampCRC = crc32(timestampHex, privateKey);
    // Calcula e retorna o CRC32 do caminho da requisição usando o CRC da timestamp como valor inicial, convertido para hexadecimal
    return crc32(path, timestampCRC).toString(16);
  }

  // Função para obter a lista de empresas favoritas
  async function getFavoriteCompanies(session, passwordHash) {
    // Obtém o ID da sessão
    const sessionId = getSessionId(session);
    // Obtém a chave privada
    const privateKey = getPrivateKey(session, passwordHash);
    // Define o caminho da requisição
    const path = 'retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas';
    // Obtém a timestamp em hexadecimal
    const timestampHex = getTimestampHex();
    // Gera a assinatura da sessão combinando o ID da sessão, a timestamp e a assinatura calculada
    const sessionSignature = `${parseInt(sessionId).toString(16)}${timestampHex}${getSessionSignature(path, privateKey, timestampHex)}`;

    // Define a URL para a requisição de empresas favoritas com a assinatura da sessão
    const url = `http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas?session_signature=${sessionSignature}`;
    // Faz a requisição GET para a URL e retorna o resultado
    const response = await axios.get(url);
    return response.data.result;
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    authenticate(userName, password).then(response => {
      if (response) {
        console.log('Autenticação bem-sucedida:', response);
        const { session, passwordHash } = response;
        onLoginSuccess(response);
        return getFavoriteCompanies(session, passwordHash);
      }
    }).then(companies => {
      if (companies) {
        console.log(companies)
        onFetchFavorites(companies);
      }
    })
      .catch(error => {
        console.error('Erro na autenticação ou ao obter empresas favoritas:', error);
        setError('Erro na autenticação ou ao obter empresas favoritas');
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
