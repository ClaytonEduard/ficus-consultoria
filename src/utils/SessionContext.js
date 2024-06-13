import React, { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(null);
    const [password, setPassword] = useState('');
    return (
        <SessionContext.Provider value={{ sessionData, setSessionData, password, setPassword }}>
            {children}
        </SessionContext.Provider>
    );
};
