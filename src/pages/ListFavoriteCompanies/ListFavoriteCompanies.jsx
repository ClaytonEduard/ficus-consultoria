import React, { useEffect, useState } from 'react';
import AuthService from '../../auth/AuthService'

const ListFavoriteCompanies = ({ sessionData }) => {
    const [favoriteCompanies, setFavoriteCompanies] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchFavoriteCompanies = async () => {
            const authService = new AuthService();
            try {
                const result = await authService.getFavoriteCompanies(sessionData.session, sessionData.passwordHash);
                setFavoriteCompanies(result);
            } catch (error) {
                setError('Error fetching favorite companies');
            }
        };

        fetchFavoriteCompanies();
    }, [sessionData]);

    return (
        <div>
            <h2>Favorite Companies</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {favoriteCompanies.map((company, index) => (
                    <li key={index}>{company.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListFavoriteCompanies;
