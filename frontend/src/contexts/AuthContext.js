// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadStorageData() {
            const storagedUser = localStorage.getItem('@AppAuth:user');
            const storagedToken = localStorage.getItem('@AppAuth:token');

            if (storagedUser && storagedToken) {
                api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
                setUser(JSON.parse(storagedUser));
            }
            setLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(email, password) {
        try {
            const response = await api.post('/sessions', { email, password });
            const { token, usuario } = response.data;

            localStorage.setItem('@AppAuth:user', JSON.stringify(usuario));
            localStorage.setItem('@AppAuth:token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(usuario);

            navigate('/dashboard');

        } catch (error) {
            console.error("Erro no login:", error);
            throw new Error(error.response?.data?.error || 'Erro ao tentar fazer login.');
        }
    }

    function signOut() {
        localStorage.removeItem('@AppAuth:user');
        localStorage.removeItem('@AppAuth:token');

        setUser(null);
        delete api.defaults.headers.common['Authorization'];

        navigate('/');
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
            {!loading ? children : <div>Carregando...</div>}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}