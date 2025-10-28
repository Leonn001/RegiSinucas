// src/pages/LocalizacoesPage.js

import React, { useState, useEffect } from 'react';
import {
    Box, Button, Grid, Paper, Typography, List, ListItem, ListItemButton, ListItemText, Dialog,
    IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import api from '../services/api';
import CidadeForm from '../components/CidadeForm';
import DistritoForm from '../components/DistritoForm';

function LocalizacoesPage() {
    const [cidades, setCidades] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
    const [modalCidadeIsOpen, setModalCidadeIsOpen] = useState(false);
    const [modalDistritoIsOpen, setModalDistritoIsOpen] = useState(false);

    const fetchData = () => {
        api.get('/cidades').then(response => {
            const novasCidades = response.data;
            setCidades(novasCidades);

            if (cidadeSelecionada) {
                const cidadeAtualizada = novasCidades.find(c => c.id === cidadeSelecionada.id);
                setCidadeSelecionada(cidadeAtualizada || null); // Reseta se a cidade foi excluída
            }
        }).catch(error => {
            console.error("Erro ao buscar cidades:", error);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCidadeClick = (cidade) => {
        if (cidadeSelecionada && cidade.id === cidadeSelecionada.id) return;
        setCidadeSelecionada(cidade);
    };

    const handleCidadeCriada = (novaCidade) => {
        setModalCidadeIsOpen(false);
        fetchData();
    };

    const handleDistritoCriado = (novoDistrito) => {
        setModalDistritoIsOpen(false);
        fetchData();
    };

    const handleExcluirCidade = async (cidadeId, cidadeNome) => {
        if (window.confirm(`Tem certeza que deseja excluir a cidade "${cidadeNome}"?`)) {
            try {
                await api.delete(`/cidades/${cidadeId}`);
                fetchData();
            } catch (error) {
                alert('Erro ao excluir cidade: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const handleExcluirDistrito = async (distritoId, distritoNome) => {
        if (window.confirm(`Tem certeza que deseja excluir o distrito "${distritoNome}"?`)) {
            try {
                await api.delete(`/distritos/${distritoId}`);
                fetchData();
            } catch (error) {
                alert('Erro ao excluir distrito: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <Box sx={{ padding: 3, fontFamily: 'Roboto, sans-serif' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Gestão de Localizações
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ mr: 2 }} variant="h6">Cidades</Typography>
                            <Button variant="contained" onClick={() => setModalCidadeIsOpen(true)}>+ Adicionar Cidade</Button>
                        </Box>

                        <List>
                            {cidades.map(cidade => (
                                <ListItem
                                    key={cidade.id}
                                    disablePadding
                                    secondaryAction={
                                        <IconButton edge="end" title="Excluir Cidade" onClick={() => handleExcluirCidade(cidade.id, cidade.nome)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemButton
                                        selected={cidadeSelecionada?.id === cidade.id}
                                        onClick={() => handleCidadeClick(cidade)}
                                    >
                                        <ListItemText primary={`${cidade.nome} - ${cidade.estado}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ mr: 2 }} variant="h6">
                                Distritos de {cidadeSelecionada ? cidadeSelecionada.nome : '...'}
                            </Typography>
                            <Button variant="contained" onClick={() => setModalDistritoIsOpen(true)} disabled={!cidadeSelecionada}>
                                + Adicionar Distrito
                            </Button>
                        </Box>

                        <List>
                            {cidadeSelecionada?.distritos?.length > 0 ? (
                                cidadeSelecionada.distritos.map(distrito => (
                                    <ListItem
                                        key={distrito.id}
                                        disablePadding
                                        secondaryAction={
                                            <IconButton edge="end" title="Excluir Distrito" onClick={() => handleExcluirDistrito(distrito.id, distrito.nome)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemButton>
                                            <ListItemText primary={distrito.nome} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem disablePadding>
                                    <ListItemText
                                        primary={cidadeSelecionada ? 'Nenhum distrito cadastrado' : 'Selecione uma cidade'}
                                        sx={{ color: 'text.secondary', pl: 2 }}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={modalCidadeIsOpen} onClose={() => setModalCidadeIsOpen(false)}>
                <CidadeForm
                    onCidadeCriada={handleCidadeCriada}
                    fecharModal={() => setModalCidadeIsOpen(false)}
                />
            </Dialog>

            <Dialog open={modalDistritoIsOpen} onClose={() => setModalDistritoIsOpen(false)}>
                <DistritoForm
                    cidades={cidades}
                    cidadeSelecionada={cidadeSelecionada}
                    onDistritoCriado={handleDistritoCriado}
                    fecharModal={() => setModalDistritoIsOpen(false)}
                />
            </Dialog>
        </Box>
    );
}

export default LocalizacoesPage;