// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import ConditionalNavbar from './components/ConditionalNavbar';

import DashboardPage from './pages/DashboardPage';
import MesasPage from './pages/MesasPage';
import ClientesPage from './pages/ClientesPage';
import LocalizacoesPage from './pages/LocalizacoesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import MesaDetailPage from './pages/MesaDetailPage';
import LoginPage from './pages/LoginPage';

import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <ConditionalNavbar />

                    <main className="content">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/" element={<Navigate to="/dashboard" />} />

                            <Route
                                path="/dashboard"
                                element={<PrivateRoute><DashboardPage /></PrivateRoute>}
                            />
                            <Route
                                path="/mesas"
                                element={<PrivateRoute><MesasPage /></PrivateRoute>}
                            />
                            <Route
                                path="/mesas/:mesaId"
                                element={<PrivateRoute><MesaDetailPage /></PrivateRoute>}
                            />
                            <Route
                                path="/clientes"
                                element={<PrivateRoute><ClientesPage /></PrivateRoute>}
                            />
                            <Route
                                path="/localizacoes"
                                element={<PrivateRoute><LocalizacoesPage /></PrivateRoute>}
                            />
                            <Route
                                path="/relatorios"
                                element={<PrivateRoute><RelatoriosPage /></PrivateRoute>}
                            />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
