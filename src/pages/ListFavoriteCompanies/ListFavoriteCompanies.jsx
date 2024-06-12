import React, { useEffect, useState } from 'react';
import AuthService from '../../auth/AuthService';

const ListFavoriteCompanies = ({ sessionId, password }) => {
    const [favoriteCompanies, setFavoriteCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authService = new AuthService();

    useEffect(() => {
        console.log("Received sessionId:", sessionId);
        console.log("Received password:", password);

        const fetchFavoriteCompanies = async () => {
            try {
                if (sessionId && password) {
                    const companies = await authService.getFavoriteCompanies(sessionId, password);
                    setFavoriteCompanies(companies);
                } else {
                    throw new Error('Session ID or password is missing');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
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
