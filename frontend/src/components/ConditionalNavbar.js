// src/components/ConditionalNavbar.js
import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

const ConditionalNavbar = () => {
    const { signed } = useAuth();
    return signed ? <Navbar /> : null;
};

export default ConditionalNavbar;
