// src/pages/MesasPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MesaForm from '../components/MesaForm';
import { Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog } from '@mui/material';

function MesasPage() {
    const [mesas, setMesas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const fetchData = () => {
        api.get('/mesas').then(response => setMesas(response.data));
        api.get('/clientes').then(response => setClientes(response.data));
        api.get('/cidades').then(response => setCidades(response.data));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMesaCriada = () => fetchData();

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Gestão de Mesas
                </Typography>
                <Button variant="contained" onClick={() => setModalIsOpen(true)}>+ Adicionar Mesa</Button>
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
                            {mesas.map(mesa => (
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