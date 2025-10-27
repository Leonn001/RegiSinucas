// src/pages/ClientesPage.js

import React, { useState, useEffect } from 'react';
import {
    Box, Button, Paper, Typography, Dialog, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow ,TextField, Select, MenuItem, FormControl, InputLabel,
    IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../services/api';
import ClienteForm from '../components/ClienteForm';

function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [cidadeFiltro, setCidadeFiltro] = useState('');

    const [clienteEmEdicao, setClienteEmEdicao] = useState(null);

    const fetchData = () => {
        api.get('/clientes').then(response => setClientes(response.data));
        api.get('/cidades').then(response => setCidades(response.data));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAbrirModal = (cliente = null) => {
        setClienteEmEdicao(cliente);
        setModalIsOpen(true);
    };

    const handleFecharModal = () => {
        setModalIsOpen(false);
        setClienteEmEdicao(null);
    };

    const handleClienteSalvo = () => {
        fetchData();
        handleFecharModal();
    };

    const handleExcluir = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await api.delete(`/clientes/${id}`);
                setClientes(clientesAtuais => clientesAtuais.filter(c => c.id !== id));
            } catch (error) {
                alert('Erro ao excluir cliente: ' + (error.response?.data?.error || 'Verifique se ele não possui mesas ativas.'));
            }
        }
    };

    const clientesFiltrados = clientes.filter(cliente => {

        const matchTexto =
            cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
            cliente.telefone.includes(filtro);

        const matchCidade = cidadeFiltro
            ? cliente.distrito?.cidade?.id === cidadeFiltro
            : true;

        return matchTexto && matchCidade;
    });

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Gestão de Clientes
                </Typography>
                <Button variant="contained" onClick={() => handleAbrirModal(null)}>+ Adicionar Cliente</Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2}}>
                <TextField
                    label="Buscar por nome ou telefone"
                    variant="outlined"
                    size="small"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    sx={{ flex: 1, backgroundColor: '#fff' }}
                />
                <FormControl size="small" sx={{ minWidth: 180}}>
                    <InputLabel>Cidade</InputLabel>
                    <Select sx={{ backgroundColor: '#fff' }}
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
            </Box>

            <Paper elevation={3} sx={{ borderRadius: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Localização</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientesFiltrados.map(cliente => (
                                <TableRow key={cliente.id} hover>
                                    <TableCell>{cliente.nome}</TableCell>
                                    <TableCell>{cliente.telefone}</TableCell>
                                    <TableCell>
                                        {cliente.distrito ? `${cliente.distrito.nome} - ${cliente.distrito.cidade.nome}` : 'Não informado'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleAbrirModal(cliente)} title="Editar">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleExcluir(cliente.id)} title="Excluir">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={modalIsOpen} onClose={handleFecharModal}>
                <ClienteForm
                    cidades={cidades}
                    clienteParaEditar={clienteEmEdicao}
                    onClienteSalvo={handleClienteSalvo}
                    fecharModal={handleFecharModal}
                />
            </Dialog>
        </Box>
    );
}

export default ClientesPage;