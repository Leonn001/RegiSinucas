// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom'; // Importamos o componente Link para navegação
import './Navbar.css'; // Vamos criar este ficheiro para estilizar a nossa barra

function Navbar() {
    return (
        <header className="app-header">
            <div className="logo">
                {/* Você pode colocar um ícone aqui depois */}
                <h1>RegiSinucas</h1>
                <span>Sistema de Gestão</span>
            </div>

            <nav className="main-nav">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/mesas">Mesas</Link>
                <Link to="/clientes">Clientes</Link>
                <Link to="/localizacoes">Localizações</Link>
                <Link to="/relatorios">Relatórios</Link>
            </nav>

            <div className="user-info">
                <span>Administrador</span>
                <small>Gestão de Sinucas</small>
            </div>
        </header>
    );
}

export default Navbar;