// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Grid, Paper, Typography, Box } from '@mui/material';
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

    useEffect(() => {
        api.get('/dashboard')
            .then(response => {
                setDashboardData(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar dados do dashboard:", error);
            });
    }, []);

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

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
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