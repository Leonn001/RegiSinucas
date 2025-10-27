// src/pages/MesasPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MesaForm from '../components/MesaForm';
import {
    Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
    TextField, Select, MenuItem, FormControl, InputLabel, IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Archive as ArchiveIcon } from '@mui/icons-material';

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
    const [mesaEmEdicao, setMesaEmEdicao] = useState(null);

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

    const handleAbrirModal = (mesa = null) => {
        setMesaEmEdicao(mesa);
        setModalIsOpen(true);
    };

    const handleFecharModal = () => {
        setModalIsOpen(false);
        setMesaEmEdicao(null);
    };

    const handleMesaSalva = () => {
        fetchData();
        handleFecharModal();
    };

    const handleExcluir = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta mesa?')) {
            try {
                await api.delete(`/mesas/${id}`);
                setMesas(mesasAtuais => mesasAtuais.filter(m => m.id !== id));
            } catch (error) {
                alert('Erro ao excluir mesa: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const handleInativar = async (id, numeroSerie) => {
        const confirmMsg = `Você tem certeza que deseja "Desalugar" a mesa ${numeroSerie}?\n\nEsta ação irá:\n1. Mudar o status para "Inativa".\n2. Mover a mesa para o "Galpão" (cliente e local).\n3. Apagar todo o histórico de leituras desta mesa.`;

        if (window.confirm(confirmMsg)) {
            try {
                await api.patch(`/mesas/${id}/inativar`);
                fetchData();
            } catch (error) {
                alert('Erro ao inativar mesa: ' + (error.response?.data?.error || error.message));
            }
        }
    };

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
                    sx={{ flex: 1,backgroundColor: '#fff' }}
                />

                <FormControl size="small" sx={{ minWidth: 180}}>
                    <InputLabel>Cidade</InputLabel>
                    <Select sx={{backgroundColor: '#fff' }}
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

                <FormControl size="small" sx={{ minWidth: 180}}>
                    <InputLabel>Status</InputLabel>
                    <Select sx={{backgroundColor: '#fff' }}
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
                                <TableCell sx={{ fontWeight: 'bold' }}>Localização</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mesasFiltradas.map(mesa => (
                                <TableRow key={mesa.id} hover>
                                    <TableCell sx={{ cursor: 'pointer' }} onClick={() => navigate(`/mesas/${mesa.id}`)}>{mesa.numero_serie}</TableCell>
                                    <TableCell sx={{ cursor: 'pointer' }} onClick={() => navigate(`/mesas/${mesa.id}`)}>{mesa.nome_ponto_comercial ?? 'N/A'}</TableCell>
                                    <TableCell sx={{ cursor: 'pointer' }} onClick={() => navigate(`/mesas/${mesa.id}`)}>{mesa.cliente?.nome ?? 'N/A'}</TableCell>
                                    <TableCell sx={{ cursor: 'pointer' }} onClick={() => navigate(`/mesas/${mesa.id}`)}>
                                        {mesa.distrito ? `${mesa.distrito.nome} - ${mesa.distrito.cidade.nome}` : 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ cursor: 'pointer' }} onClick={() => navigate(`/mesas/${mesa.id}`)}>{mesa.status}</TableCell>

                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleAbrirModal(mesa)} title="Editar">
                                            <EditIcon />
                                        </IconButton>
                                        {mesa.status === 'Ativa' && (
                                            <IconButton size="small" onClick={() => handleInativar(mesa.id, mesa.numero_serie)} title="Desalugar / Inativar">
                                                <ArchiveIcon />
                                            </IconButton>
                                        )}
                                        <IconButton size="small" onClick={() => handleExcluir(mesa.id)} title="Excluir">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Dialog open={modalIsOpen} onClose={handleFecharModal} fullWidth maxWidth="sm">
                <MesaForm
                    clientes={clientes}
                    cidades={cidades}
                    mesaParaEditar={mesaEmEdicao}
                    onMesaSalva={handleMesaSalva}
                    fecharModal={handleFecharModal}
                />
            </Dialog>
        </Box>
    );
}

export default MesasPage;