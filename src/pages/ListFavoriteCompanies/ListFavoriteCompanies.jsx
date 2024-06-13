import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SessionContext } from '../../utils/SessionContext';
import { crc32 } from '../../utils/crc32';
import CryptoJS from 'crypto-js';


function ListFavoriteCompanies() {
    const { sessionData, password } = useContext(SessionContext);
    const [favoriteCompanies, setFavoriteCompanies] = useState([]);
    useEffect(() => {
        const fetchFavoriteCompanies = async () => {
            try {
                if (!sessionData || !password) {
                    throw new Error('Sessão ou senha não encontrada');
                }
                console.log("Session= " + sessionData)
                const sessionId = sessionData.split('+')[0];
                console.log("ID Sessao: " + sessionId)

                const hashSesao = crc32(sessionData);

                const hashedId = crc32(sessionId).toString(16)
                console.log('Password: ' + password)
                const hashedPassword = crc32(password).toString(16)
                console.log('Hash Password: ' + hashedPassword)

                const privateKey = crc32(hashSesao, hashedPassword).toString(16);
                //const privateKey = `${sessionId}${hashSesao}${hashedPassword}`;

                console.log("Passw Private: " + privateKey)
                const timestamp = Date.now().toString();
                console.log('Data: ' + timestamp)
                const timestampHex = (Date.now() / 1000 | 0).toString(16).split(-8);
                console.log('Data P: ' + timestampHex)

                const path = `retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas`;

                const crc32Timestamp = crc32(timestampHex, sessionId);
                //console.log('Crc32 Times e KEY: ' + crc32Timestamp)
                const crc32Path = crc32(path, timestampHex).toString(16);
                const assinaturaSessao = crc32Path.toString(16);
                console.log('Assinatura CR32: ' + assinaturaSessao)
                const sessionSignature = `${sessionId}${timestampHex}${privateKey}`;
                //console.log('Signature: ' + sessionSignature)

                const response = await axios.get(`http://test.ficusconsultoria.com.br:11118/retaguarda_prospect/aaaa/empresaService/PegarEmpresasFavoritas?session_signature=${sessionSignature}`);


                setFavoriteCompanies(response.data.result);
            } catch (error) {
                console.error('Erro ao buscar empresas:', error);
            }
        };

        fetchFavoriteCompanies();
    }, [sessionData, password]);

    return (
        <div>
            <h2>Empresas Favoritas</h2>
            <ul>
                {favoriteCompanies.map(company => (
                    <li key={company.id}>{company.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListFavoriteCompanies;
