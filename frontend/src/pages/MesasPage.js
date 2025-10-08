// src/pages/MesasPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MesaForm from '../components/MesaForm';

import { Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog } from '@mui/material';

function MesasPage() {
    const [mesas, setMesas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para o modal

    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            api.get('/mesas'),
            api.get('/clientes'),
            api.get('/distritos'),
            api.get('/cidades')
        ]).then(([mesasResponse, clientesResponse, distritosResponse, cidadesResponse]) => {
            setMesas(mesasResponse.data);
            setClientes(clientesResponse.data);
            setDistritos(distritosResponse.data);
            setCidades(cidadesResponse.data); // <-- Guardamos as cidades no estado
        }).catch(error => console.error("Erro ao buscar dados:", error));
    }, []);

    const handleMesaCriada = (novaMesa) => {
        setMesas([...mesas, novaMesa]);
    };

    const findClienteName = (clienteId) => {
        const cliente = clientes.find(c => c.id === clienteId);
        return cliente ? cliente.nome : 'N/A';
    };

    const findLocation = (distritoId) => {
        if (!distritoId || !distritos.length || !cidades.length) {
            return { distrito: 'N/A', cidade: 'N/A' };
        }
        const distrito = distritos.find(d => d.id === distritoId);
        if (!distrito) {
            return { distrito: 'Inválido', cidade: 'Inválida' };
        }
        const cidade = cidades.find(c => c.id === distrito.cidade_id);
        return {
            distrito: distrito.nome,
            cidade: cidade ? cidade.nome : 'N/A'
        };
    };

    const handleMesaClick = (mesaId) => {
        navigate(`/mesas/${mesaId}`);
    };

    return (
        <Box sx={{ padding: 3, fontFamily: 'Roboto, sans-serif' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Gestão de Mesas
                </Typography>
                <Button variant="contained" onClick={() => setModalIsOpen(true)}>
                    + Adicionar Mesa
                </Button>
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
                                    onClick={() => handleMesaClick(mesa.id)}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{mesa.numero_serie}</TableCell>
                                    <TableCell>{mesa.nome_ponto_comercial}</TableCell>
                                    <TableCell>{findClienteName(mesa.cliente_id)}</TableCell>
                                    <TableCell>{findLocation(mesa.distrito_id).cidade}</TableCell>
                                    <TableCell>{findLocation(mesa.distrito_id).distrito}</TableCell>
                                    <TableCell>{mesa.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)} fullWidth maxWidth="sm">
                <MesaForm
                    clientes={clientes}
                    cidades={cidades}
                    onMesaCriada={handleMesaCriada}
                    fecharModal={() => setModalIsOpen(false)}
                />
            </Dialog>
        </Box>
    );
}

export default MesasPage;