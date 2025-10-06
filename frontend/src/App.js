// src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importa a nossa nova barra de navegação

// Importa todas as nossas páginas
import DashboardPage from './pages/DashboardPage';
import MesasPage from './pages/MesasPage';
import ClientesPage from './pages/ClientesPage';
import LocalizacoesPage from './pages/LocalizacoesPage';
import RelatoriosPage from './pages/RelatoriosPage';

import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar /> {/* A nossa barra de navegação agora aparece em todas as páginas */}

                <main className="content">
                    <Routes>
                        {/* Rota Padrão: Redireciona para o dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />

                        {/* Define qual componente mostrar para cada URL */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/mesas" element={<MesasPage />} />
                        <Route path="/clientes" element={<ClientesPage />} />
                        <Route path="/localizacoes" element={<LocalizacoesPage />} />
                        <Route path="/relatorios" element={<RelatoriosPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;