// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Grid, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function KpiCard({ title, value }) {
    return (
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Paper>
    );
}

function DashboardPage() {
    const [dashboardData, setDashboardData] = useState(null);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());

    const meses = Array.from({ length: 12 }, (_, i) => ({
        nome: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
        valor: i + 1,
    }));

    const anoAtual = new Date().getFullYear();
    const anos = Array.from({ length: 11 }, (_, i) => anoAtual - 5 + i);

    const carregarDashboard = async () => {
        try {
            const response = await api.get(`/dashboard?mes=${mes}&ano=${ano}`);
            setDashboardData(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
        }
    };

    useEffect(() => {
        carregarDashboard();
    }, [mes, ano]);

    if (!dashboardData) {
        return <Typography variant="h5" align="center" sx={{ mt: 5 }}>Carregando dados do Dashboard...</Typography>;
    }

    const { kpis, lucroPorCidade } = dashboardData;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Dashboard</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard title="Total de Mesas" value={kpis.totalMesas} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard title="Mesas Ativas" value={kpis.mesasAtivas} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard title="Mesas Inativas" value={kpis.mesasInativas} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard title="Manutenções Pendentes" value={kpis.manutencoesPendentes} />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Mês</InputLabel>
                    <Select
                        value={mes}
                        label="Mês"
                        onChange={(e) => setMes(e.target.value)}
                    >
                        {meses.map((m) => (
                            <MenuItem key={m.valor} value={m.valor}>{m.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Ano</InputLabel>
                    <Select
                        value={ano}
                        label="Ano"
                        onChange={(e) => setAno(e.target.value)}
                    >
                        {anos.map((a) => (
                            <MenuItem key={a} value={a}>{a}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8} width="100%">
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 400 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Lucro por Cidade</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={lucroPorCidade}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="Lucro" fill="#007bff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashboardPage;
