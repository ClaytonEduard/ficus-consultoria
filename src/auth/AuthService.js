import axios from 'axios';
import CryptoJS from 'crypto-js';
import { crc32 } from 'crc';


const API_URL = 'http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa';
const SALT = 'salt';
class AuthService {

    async authenticateUser(userName, password) {
        try {
            // capturando a sessao
            const serverNonce = await this.getServer(userName);

            // pegando a data e hora atual
            const data = new Date().toISOString();

            // nonce do Cliente
            const clientNonce = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);

            //* Criptografando a senha com (salt+senha)
            const hashedPassword = CryptoJS.SHA256(SALT + password).toString(CryptoJS.enc.Hex);

            this.getPrivateKey(hashedPassword)

            //* Criptografando a senha com o server
            const geraHasString = `retaguarda_prospect/${userName}${serverNonce}${clientNonce}${userName}${hashedPassword}`;

            const encodedPassword = CryptoJS.SHA256(geraHasString).toString(CryptoJS.enc.Hex);

            // ? Resposta do Server - deve vir um Json com dados de acesso
            const response = await axios.get(`${API_URL}/auth?UserName=${userName}&Password=${encodedPassword}&ClientNonce=${clientNonce}`);

            const idSessao = this.getIdJson(response.data.result);
            console.log('ID Sessao: ' + idSessao);

            const sessionSignature = this.calculateSessionSignature(idSessao, encodedPassword);
            console.log('Session Signature: ' + sessionSignature);

            // Pegar empresas favoritas com a assinatura da sessão
            const empresas = await this.getFavoriteCompanies(idSessao, encodedPassword);
            console.log(empresas);

            return empresas;
        } catch (error) {
            console.error('Erro na autenticação:', error);
        }

    }
    //capturar a autorizacao
    async getServer(userName) {
        try {
            const response = await axios.get(`${API_URL}/auth?UserName=${userName}`);
            return response.data.result;
        } catch (error) {
            console.error('Erro ao obter server nonce:', error);
        }
    }
    // capturar o ID da sessao
    getIdJson(jsonServer) {
        const regex = /(\d+)\+/;
        const match = jsonServer.match(regex);
        if (match) {
            return match[1];
        }
    }

    // criar o CRC32 da senha criptografada
    calculateCRC32(hashsenha) {
        return (crc32.str(hashsenha) >>> 0).toString(16);
    }

    getPrivateKey(key) {
        return key;
    }

    calculateSessionSignature(sessionId, password) {
        const sessionCrc = this.calculateCRC32(`${sessionId}+${password}`);
        const sessionPrivateKey = crc32('9898410d7f5045bc673db80c1a49b74f088fd7440037d8ce25c7d272a505bce5', sessionCrc);

        const timestamp = Date.now();
        const timestampHex = timestamp.toString(16).slice(-8);

        const timestampCrc = crc32(timestampHex, sessionPrivateKey);
        const path = 'retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas';
        const assinaturaSessaoCrc = crc32(path, timestampCrc);

        const assinaturaSessao = `${parseInt(sessionId).toString(16)}${timestampHex}${(assinaturaSessaoCrc >>> 0).toString(16)}`;
        return assinaturaSessao;
    }

    // Pegar empresas favoritas
    async getFavoriteCompanies(sessionId, encodedPassword) {
        const sessionSignature = this.calculateSessionSignature(sessionId, encodedPassword);
        const url = `${API_URL}/empresaService/PegarEmpresasFavoritas?session_signature=${sessionSignature}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar empresas favoritas:', error);
        }
    }

}

export default AuthService;
