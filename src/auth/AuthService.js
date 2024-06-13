import axios from 'axios';
import CryptoJS from 'crypto-js';
import crc32 from 'crc-32';


const API_URL = 'http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa';
const SALT = 'salt';
class AuthService {

    async authenticateUser(userName, password) {
        try {
            // capturando a sessao
            console.log('Usuario: ' + userName)
            const serverNonce = await this.getServer(userName);

            // pegando a data e hora atual
            const data = new Date().toISOString();

            // nonce do Cliente
            const clientNonce = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);

            //* Criptografando a senha com (salt+senha)
            const hashedPassword = CryptoJS.SHA256(SALT + password).toString(CryptoJS.enc.Hex);
            console.log('Senha com salt: ' + hashedPassword)


            //* Criptografando a senha com o server
            const geraHasString = `retaguarda_prospect/${userName}${serverNonce}${clientNonce}${userName}${hashedPassword}`;

            const encodedPassword = CryptoJS.SHA256(geraHasString).toString(CryptoJS.enc.Hex);

            // ? Resposta do Server - deve vir um Json com dados de acesso
            const response = await axios.get(`${API_URL}/auth?UserName=${userName}&Password=${encodedPassword}&ClientNonce=${clientNonce}`);

            const favoriteCompanies = await this.getFavoriteCompanies(response.data.result, hashedPassword);
            console.log("Response Get Favorite: " + favoriteCompanies);
            return response.data.result;
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

    calculateSessionSignature(session, password) {

        const sessionId = crc32.str(String(session.split('+')[0])); // ID da sessão

        const sessionCRC32 = crc32.str(String(session), 0)// * Sesao
        const passwordHash = crc32.str(String(password), 0);
        const privateKey = crc32.str(String(passwordHash), sessionId)

        const timestampHex = (Date.now() / 1000 | 0).toString(16);

        const path = `retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas`;

        const crc32Timestamp = crc32.str(String(timestampHex), privateKey);
        const crc32Path = crc32.str(String(path), crc32Timestamp);
        const assinaturaSessao = crc32Path;


        const sessionSignature = `${parseInt(sessionId).toString(16)}${timestampHex}${assinaturaSessao}`;
        console.log("ASSINATURA SESAO: " + sessionSignature)
        return sessionSignature
    }

    async getFavoriteCompanies(sessionId, password) {
        const sessionSignature = this.calculateSessionSignature(sessionId, password);
        const url = `${API_URL}/empresaService/PegarEmpresasFavoritas?session_signature=${sessionSignature}`;

        try {

            const response = await axios.get(url, {
                params: {
                    session_signature: sessionSignature
                }
            });
            console.log("Get Favorite: " + response)
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar empresas favoritas:', error);
        }
    }
}

export default AuthService;
