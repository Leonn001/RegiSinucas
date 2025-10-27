// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Grid, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

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
    const [lucroDistritos, setLucroDistritos] = useState([]);
    const [cidades, setCidades] = useState([]);

    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(new Date().getFullYear());
    const [cidadeSelecionada, setCidadeSelecionada] = useState('');

    const meses = Array.from({ length: 12 }, (_, i) => ({
        nome: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
        valor: i + 1,
    }));
    const anoAtual = new Date().getFullYear();
    const anos = Array.from({ length: 6 }, (_, i) => anoAtual - 4 + i);

    const carregarDashboard = async () => {
        try {
            const response = await api.get(`/dashboard?mes=${mes}&ano=${ano}`);
            setDashboardData(response.data);

            const cidadesUnicas = [...new Set(response.data.lucroPorCidade.map(c => c.name))];
            setCidades(cidadesUnicas);
        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
        }
    };

    const carregarLucroDistritos = async (cidade) => {
        if (!cidade) {
            setLucroDistritos([]);
            return;
        }
        try {
            const response = await api.get(`/dashboard/lucro-por-distrito?cidade=${encodeURIComponent(cidade)}&mes=${mes}&ano=${ano}`);
            setLucroDistritos(response.data);
        } catch (error) {
            console.error("Erro ao buscar lucro por distrito:", error);
        }
    };

    useEffect(() => {
        carregarDashboard();
    }, [mes, ano]);

    useEffect(() => {
        if (cidadeSelecionada && cidadeSelecionada !== '') {
            carregarLucroDistritos(cidadeSelecionada);
        } else {
            setLucroDistritos([]);
        }
    }, [cidadeSelecionada, mes, ano]);

    if (!dashboardData) {
        return <Typography variant="h5" align="center" sx={{ mt: 5 }}>Carregando dados do Dashboard...</Typography>;
    }

    const { kpis, lucroPorCidade } = dashboardData;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943']

    return (
        <Box sx={{ p: 3 }}>
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
                {/*<Grid item xs={12} sm={6} md={3}>
                    <KpiCard title="Manutenções Pendentes" value={kpis.manutencoesPendentes} />
                </Grid>*/}
            </Grid>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Mês</InputLabel>
                    <Select sx={{backgroundColor: '#fff' }} value={mes} label="Mês" onChange={(e) => setMes(e.target.value)}>
                        {meses.map((m) => (
                            <MenuItem key={m.valor} value={m.valor}>
                                {m.nome.charAt(0).toUpperCase() + m.nome.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Ano</InputLabel>
                    <Select sx={{backgroundColor: '#fff' }} value={ano} label="Ano" onChange={(e) => setAno(e.target.value)}>
                        {anos.map((a) => (
                            <MenuItem key={a} value={a}>{a}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{minWidth: 200 }}>
                    <InputLabel>Cidade</InputLabel>
                    <Select sx={{backgroundColor: '#fff' }}
                        value={cidadeSelecionada}
                        label="Cidade"
                        onChange={(e) => setCidadeSelecionada(e.target.value)}
                    >
                        {cidades.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5, mb: 3 }}>
                <Grid container spacing={3} sx={{width: '60%' }}>
                    <Grid item xs={12} sx={{width:'100%'}}>
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

                {cidadeSelecionada && (
                    <Grid container spacing={3} sx={{width: '30%' }}>
                        <Grid item xs={12} sx={{width:'100%'}}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 400, width: 400 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Lucro por Distrito - {cidadeSelecionada}
                                </Typography>
                                <ResponsiveContainer width="100%" height="90%">
                                    <PieChart>
                                        <Pie data={lucroDistritos} dataKey="Lucro" nameKey="name" label={(entry) => entry.name}>
                                            {lucroDistritos.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                                        <Legend formatter={(value, entry, index) => entry.payload.name} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Box>

        </Box>
    );
}

export default DashboardPage;
