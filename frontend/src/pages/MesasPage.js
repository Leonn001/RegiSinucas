// src/pages/MesasPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MesaForm from '../components/MesaForm';
import {
    Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
    TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

const ordenarPorNumeroSerie = (a, b) => {
    const numA = parseInt(a.numero_serie.split('-')[1], 10);
    const numB = parseInt(b.numero_serie.split('-')[1], 10);
    return numA - numB;
};

function MesasPage() {
    const [mesas, setMesas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [cidadeFiltro, setCidadeFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const navigate = useNavigate();

    const fetchData = () => {
        api.get('/mesas').then(response => {
            const mesasOrdenadas = response.data.sort(ordenarPorNumeroSerie);
            setMesas(mesasOrdenadas);
        });
        api.get('/clientes').then(response => setClientes(response.data));
        api.get('/cidades').then(response => setCidades(response.data));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMesaCriada = () => fetchData();

    const mesasFiltradas = mesas.filter(mesas => {

        const matchTexto =
            mesas.numero_serie.toLowerCase().includes(filtro.toLowerCase()) ||
            mesas.nome_ponto_comercial.toLowerCase().includes(filtro.toLowerCase()) ||
            mesas.cliente?.nome.toLowerCase().includes(filtro.toLowerCase());

        const matchCidade = cidadeFiltro
            ? mesas.distrito?.cidade?.id === cidadeFiltro
            : true;

        const matchStatus = statusFiltro
            ? mesas.status === statusFiltro
            : true

        return matchTexto && matchCidade && matchStatus;
    });

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Gestão de Mesas
                </Typography>
                <Button variant="contained" onClick={() => setModalIsOpen(true)}>+ Adicionar Mesa</Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Buscar por N° Série, Ponto ou Cliente"
                    variant="outlined"
                    size="small"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    sx={{ flex: 1 }}
                />

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Cidade</InputLabel>
                    <Select
                        value={cidadeFiltro}
                        label="Cidade"
                        onChange={(e) => setCidadeFiltro(e.target.value)}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {cidades.map((cidade) => (
                            <MenuItem key={cidade.id} value={cidade.id}>{cidade.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFiltro}
                        label="Status"
                        onChange={(e) => setStatusFiltro(e.target.value)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="Ativa">Ativa</MenuItem>
                        <MenuItem value="Inativa">Inativa</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Paper elevation={3} sx={{ borderRadius: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nº de Série</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Ponto Comercial</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Cidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Distrito</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mesasFiltradas.map(mesa => (
                                <TableRow
                                    key={mesa.id}
                                    onClick={() => navigate(`/mesas/${mesa.id}`)}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{mesa.numero_serie}</TableCell>
                                    <TableCell>{mesa.nome_ponto_comercial}</TableCell>
                                    <TableCell>{mesa.cliente?.nome}</TableCell>
                                    <TableCell>{mesa.distrito?.cidade?.nome}</TableCell>
                                    <TableCell>{mesa.distrito?.nome}</TableCell>
                                    <TableCell>{mesa.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)} fullWidth maxWidth="sm">
                <MesaForm clientes={clientes} cidades={cidades} onMesaCriada={handleMesaCriada} fecharModal={() => setModalIsOpen(false)} />
            </Dialog>
        </Box>
    );
}

export default MesasPage;