// src/pages/LocalizacoesPage.js

import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, Typography, List, ListItem, ListItemButton, ListItemText, Dialog } from '@mui/material';
import api from '../services/api';
import CidadeForm from '../components/CidadeForm';
import DistritoForm from '../components/DistritoForm';

function LocalizacoesPage() {
    const [cidades, setCidades] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
    const [modalCidadeIsOpen, setModalCidadeIsOpen] = useState(false);
    const [modalDistritoIsOpen, setModalDistritoIsOpen] = useState(false);

    useEffect(() => {
        api.get('/cidades').then(response => {
            setCidades(response.data);
        });
    }, []);

    useEffect(() => {
        if (cidadeSelecionada) {
            api.get(`/cidades/${cidadeSelecionada.id}/distritos`).then(response => {
                setDistritos(response.data);
            });
        } else {
            setDistritos([]);
        }
    }, [cidadeSelecionada]);

    const handleCidadeClick = (cidade) => {
        if (cidadeSelecionada && cidade.id === cidadeSelecionada.id) return;
        setCidadeSelecionada(cidade);
    };

    const handleCidadeCriada = (novaCidade) => {
        setCidades([...cidades, novaCidade]);
        setModalCidadeIsOpen(false);
    };

    const handleDistritoCriado = (novoDistrito) => {
        if (cidadeSelecionada && novoDistrito.cidade_id === cidadeSelecionada.id) {
            setDistritos([...distritos, novoDistrito]);
        }
        setModalDistritoIsOpen(false);
    };

    return (
        <Box sx={{ padding: 3, fontFamily: 'Roboto, sans-serif' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestão de Localizações
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Cidades</Typography>
                            <Button variant="contained" onClick={() => setModalCidadeIsOpen(true)}>+ Adicionar Cidade</Button>
                        </Box>
                        <List>
                            {cidades.map(cidade => (
                                <ListItem key={cidade.id} disablePadding>
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
                            <Typography variant="h6">
                                Distritos de {cidadeSelecionada ? cidadeSelecionada.nome : '...'}
                            </Typography>
                            <Button variant="contained" onClick={() => setModalDistritoIsOpen(true)} disabled={!cidadeSelecionada}>
                                + Adicionar Distrito
                            </Button>
                        </Box>
                        <List>
                            {distritos.map(distrito => (
                                <ListItem key={distrito.id} disablePadding>
                                    <ListItemButton>
                                        <ListItemText primary={distrito.nome} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={modalCidadeIsOpen} onClose={() => setModalCidadeIsOpen(false)}>
                <CidadeForm onCidadeCriada={handleCidadeCriada} fecharModal={() => setModalCidadeIsOpen(false)} />
            </Dialog>

            <Dialog open={modalDistritoIsOpen} onClose={() => setModalDistritoIsOpen(false)}>
                <DistritoForm cidades={cidades} onDistritoCriado={handleDistritoCriado} fecharModal={() => setModalDistritoIsOpen(false)} />
            </Dialog>
        </Box>
    );
}

export default LocalizacoesPage;