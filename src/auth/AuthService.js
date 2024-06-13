const axios = require('axios');  // Importa a biblioteca axios para fazer requisições HTTP
const crypto = require('crypto'); // Importa a biblioteca crypto para usar funções criptográficas
const crc32 = require('crc').crc32;

class AuthService {
    // Função para obter o nonce do servidor
    async getServerNonce(userName) {
        // Define a URL com o nome do usuário
        const url = `http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa/auth?UserName=${userName}`;
        // Faz uma requisição GET para a URL
        const response = await axios.get(url);
        console.log(response)
        // Retorna o nonce do servidor presente na resposta
        return response.data.result;
    }
    //! Funcao para gerar o nonce do cliente
    getClientNonce() {
        // Obtém a data e hora atual em formato ISO
        const currentTime = new Date().toISOString();
        // Gera o hash SHA256 da data e hora atual
        return crypto.createHash('sha256').update(currentTime).digest('hex');
        // return sha256.createHash('sha256').update(currentTime).digest('hex');
    }

    // Função para codificar a senha
    encodePassword(userName, serverNonce, clientNonce, password) {
        const salt = 'salt'; // Define o salt
        // Combina o salt com a senha
        const saltedPassword = salt + password;
        // Gera o hash SHA256 da combinação salt + senha
        const hash1 = crypto.createHash('sha256').update(saltedPassword).digest('hex');

        // Combina várias strings conforme especificado
        const combinedString = `retaguarda_prospect/${userName}${serverNonce}${clientNonce}${userName}${hash1}`;

        // Gera o hash SHA256 da string combinada
        return crypto.createHash('sha256').update(combinedString).digest('hex');
    }

    //! Função para gerar o hash da senha  
    hashPassword(password) {
        const salt = 'salt'; // Define o salt
        // Combina o salt com a senha
        const saltedPassword = salt + password;
        // Gera e retorna o hash SHA256 da combinação salt + senha
        return crypto.createHash('sha256').update(saltedPassword).digest('hex');
        // return crypto.createHash('sha256').update(saltedPassword).digest('hex');
    }

    async authenticate(userName, password) {
        try {
            console.log(userName)
            // Obtém o nonce do servidor
            const serverNonce = await this.getServerNonce(userName);
            // Gera o nonce do cliente
            const clientNonce = this.getClientNonce();
            // Codifica a senha usando os nonces e o nome do usuário
            const encodedPassword = this.encodePassword(userName, serverNonce, clientNonce, password);
            // Define a URL para autenticação com os parâmetros necessários
            const url = `http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa/auth?UserName=${userName}&Password=${encodedPassword}&ClientNonce=${clientNonce}`;
            // Faz a requisição GET para a URL de autenticação
            const response = await axios.get(url);
            // Retorna o resultado da autenticação e o hash da senha
            return {
                session: response.data.result,
                passwordHash: this.hashPassword(password)
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
    getSessionId(session) {
        // Divide a string da sessão e retorna a parte antes do '+'
        return session.split('+')[0];
    }

    // Função para obter a chave privada
    getPrivateKey(session, passwordHash) {
        // Calcula o CRC32 do valor da sessão
        const sessionCRC = crc32(session);
        // Calcula e retorna o CRC32 do hash da senha usando o valor da sessão CRC como valor inicial
        return crc32(passwordHash, sessionCRC);
    }

    // Função para obter a timestamp em hexadecimal
    getTimestampHex() {
        // Obtém o timestamp atual em milissegundos
        let timestamp = Date.now();
        // Converte o timestamp para uma string hexadecimal
        let hexTimestamp = timestamp.toString(16);
        // Retorna os últimos 8 dígitos da string hexadecimal
        return hexTimestamp.slice(-8);
    }

    // Função para calcular a assinatura da sessão
    getSessionSignature(path, privateKey, timestampHex) {
        // Calcula o CRC32 da timestamp hexadecimal usando a chave privada como valor inicial
        const timestampCRC = crc32(timestampHex, privateKey);
        // Calcula e retorna o CRC32 do caminho da requisição usando o CRC da timestamp como valor inicial, convertido para hexadecimal
        return crc32(path, timestampCRC).toString(16);
    }

    // Função para obter a lista de empresas favoritas
    async getFavoriteCompanies(session, passwordHash) {
        // Obtém o ID da sessão
        const sessionId = this.getSessionId(session);
        // Obtém a chave privada
        const privateKey = this.getPrivateKey(session, passwordHash);
        // Define o caminho da requisição
        const path = 'retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas';
        // Obtém a timestamp em hexadecimal
        const timestampHex = this.getTimestampHex();
        // Gera a assinatura da sessão combinando o ID da sessão, a timestamp e a assinatura calculada
        const sessionSignature = `${parseInt(sessionId).toString(16)}${timestampHex}${this.getSessionSignature(path, privateKey, timestampHex)}`;
        // Define a URL para a requisição de empresas favoritas com a assinatura da sessão
        const url = `http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas?session_signature=${sessionSignature}`;
        // Faz a requisição GET para a URL e retorna o resultado
        const response = await axios.get(url);
        return response.data.result;
    }
    // Retorna um objeto contendo todas as funções definidas

}

export default AuthService;

// const userName = 'aaaa'; // Nome de usuário
// const password = '123456'; // Senha

// authenticate(userName, password)
//     .then(response => {
//         if (response) {
//             console.log('Autenticação bem-sucedida:', response);
//             const { session, passwordHash } = response;
//             return getFavoriteCompanies(session, passwordHash);
//         }
//     })
//     .then(companies => {
//         if (companies) {
//             console.log('Empresas favoritas:', companies);
//         }
//     })
//     .catch(error => {
//         console.error('Erro na autenticação ou ao obter empresas favoritas:', error);
//     });
