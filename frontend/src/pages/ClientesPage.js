// src/pages/ClientesPage.js

import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, Dialog, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';
import ClienteForm from '../components/ClienteForm';

function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get('/clientes'),
            api.get('/cidades'),
            api.get('/distritos'),
        ]).then(([clientesResponse, cidadesResponse, distritosResponse]) => {
            setClientes(clientesResponse.data);
            setCidades(cidadesResponse.data);
            setDistritos(distritosResponse.data);
        }).catch(error => {
            console.error("Erro ao buscar dados iniciais:", error);
        });
    }, []);

    const handleClienteCriado = () => {
        api.get('/clientes').then(response => setClientes(response.data));
    };

    const getLocationNames = (distritoId) => {
        if (!distritoId || distritos.length === 0 || cidades.length === 0) {
            return 'Não informado';
        }
        const distrito = distritos.find(d => d.id === distritoId);
        if (!distrito) {
            return 'Distrito Inválido';
        }
        const cidade = cidades.find(c => c.id === distrito.cidade_id);
        return cidade ? `${distrito.nome} - ${cidade.nome}` : distrito.nome;
    };

    return (
        <Box sx={{ padding: 3, fontFamily: 'Roboto, sans-serif' }}>
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
                                    {/* 4. USAMOS O NOSSO "TRADUTOR" AQUI */}
                                    <TableCell>{getLocationNames(cliente.distrito_id)}</TableCell>
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