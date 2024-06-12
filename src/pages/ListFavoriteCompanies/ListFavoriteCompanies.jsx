import React, { useEffect, useState } from 'react';
import AuthService from '../../auth/AuthService'

const ListFavoriteCompanies = ({ sessionId, password }) => {
    const [favoriteCompanies, setFavoriteCompanies] = useState([]);
    const authService = new AuthService();
    useEffect(() => {
        const fetchFavoriteCompanies = async () => {
            try {
                const companies = await authService.getFavoriteCompanies(sessionId, password);
                console.log(sessionId + password)
                setFavoriteCompanies(companies);
            } catch (error) {
                console.error('Erro ao obter empresas favoritas:', error.message);
            }
        };

        fetchFavoriteCompanies();
    }, [sessionId, password]);

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
