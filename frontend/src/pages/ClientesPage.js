// src/pages/ClientesPage.js

import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, Dialog, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';
import ClienteForm from '../components/ClienteForm';

function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const fetchData = () => {
        api.get('/clientes').then(response => setClientes(response.data));
        api.get('/cidades').then(response => setCidades(response.data));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClienteCriado = () => {
        fetchData();
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Gestão de Clientes
                </Typography>
                <Button variant="contained" onClick={() => setModalIsOpen(true)}>+ Adicionar Cliente</Button>
            </Box>

            <Paper elevation={3} sx={{ borderRadius: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Localização</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientes.map(cliente => (
                                <TableRow key={cliente.id} hover>
                                    <TableCell>{cliente.nome}</TableCell>
                                    <TableCell>{cliente.telefone}</TableCell>
                                    <TableCell>
                                        {cliente.distrito ? `${cliente.distrito.nome} - ${cliente.distrito.cidade.nome}` : 'Não informado'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                <ClienteForm
                    cidades={cidades}
                    onClienteCriado={handleClienteCriado}
                    fecharModal={() => setModalIsOpen(false)}
                />
            </Dialog>
        </Box>
    );
}

export default ClientesPage;