// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { signed, loading } = useAuth();

    if (loading) return <div>Carregando...</div>;

    return signed ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
