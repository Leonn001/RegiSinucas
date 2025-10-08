// src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import DashboardPage from './pages/DashboardPage';
import MesasPage from './pages/MesasPage';
import ClientesPage from './pages/ClientesPage';
import LocalizacoesPage from './pages/LocalizacoesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import MesaDetailPage from './pages/MesaDetailPage';

import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />

                <main className="content">
                    <Routes>
                        {/* Rota Padrão: Redireciona para o dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />

                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/mesas" element={<MesasPage />} />
                        <Route path="/mesas/:mesaId" element={<MesaDetailPage />} />
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