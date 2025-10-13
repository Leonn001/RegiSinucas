// src/pages/MesaDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format, parseISO } from 'date-fns';
import { Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function MesaDetailPage() {
    const { mesaId } = useParams();
    const navigate = useNavigate();

    const [mesa, setMesa] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [cidades, setCidades] = useState([]);

    const [contadorAtual, setContadorAtual] = useState('');
    const [descontoFichas, setDescontoFichas] = useState('');
    const [valorPago, setValorPago] = useState('');
    const [dataLeitura, setDataLeitura] = useState(getTodayDateString());

    const fetchData = () => {
        Promise.all([
            api.get(`/mesas/${mesaId}`),
            api.get(`/mesas/${mesaId}/leituras`),
            api.get('/clientes'),
            api.get('/distritos'),
            api.get('/cidades')
        ]).then(([mesaResponse, leiturasResponse, clientesResponse, distritosResponse, cidadesResponse]) => {
            setMesa(mesaResponse.data);
            setHistorico(leiturasResponse.data);
            setClientes(clientesResponse.data);
            setDistritos(distritosResponse.data);
            setCidades(cidadesResponse.data);
        }).catch(error => {
            console.error("Erro ao carregar dados da página:", error);
        });
    };

    useEffect(() => {
        fetchData();
    }, [mesaId]);

    const handleSalvarLeitura = async () => {
        if (!contadorAtual || parseInt(contadorAtual) < mesa.contador_ultima_leitura) {
            return alert('O contador atual deve ser um número válido e maior que o último contador.');
        }

        const dadosLeitura = {
            mesa_id: parseInt(mesaId),
            contador_atual_na_visita: parseInt(contadorAtual),
            desconto_fichas: parseInt(descontoFichas || 0),
            valor_pago: parseFloat(valorPago || 0),
            data_leitura: dataLeitura,
        };

        try {
            await api.post('/leituras', dadosLeitura);
            alert('Leitura salva com sucesso!');
            setContadorAtual('');
            setDescontoFichas('');
            setValorPago('');
            setDataLeitura(getTodayDateString());
            fetchData();
        } catch (error) {
            alert('Erro ao salvar leitura: ' + (error.response?.data?.error || error.message));
        }
    };

    if (!mesa) {
        return <Typography variant="h5" align="center" sx={{ mt: 5 }}>Carregando...</Typography>;
    }

    const cliente = clientes.find(c => c.id === mesa.cliente_id);
    const distrito = distritos.find(d => d.id === mesa.distrito_id);
    const cidade = distrito ? cidades.find(c => c.id === distrito.cidade_id) : null;

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start'}}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/mesas')} sx={{ mb: 2 }}>
                    Voltar para a lista
                </Button>
            </Box>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>{mesa.numero_serie}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1"><strong>Ponto Comercial:</strong> {mesa.nome_ponto_comercial}</Typography>
                        <Typography variant="body1"><strong>Cliente:</strong> {cliente ? cliente.nome : '...'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1"><strong>Localização:</strong> {distrito && cidade ? `${distrito.nome} - ${cidade.nome}` : '...'}</Typography>
                        <Typography variant="body1"><strong>Valor da Ficha:</strong> R$ {parseFloat(mesa.valor_ficha_padrao).toFixed(2)}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>Registrar Leitura do Mês</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                        <TextField label="Data da Leitura" type="date" value={dataLeitura} onChange={e => setDataLeitura(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField label="Último Contador" value={mesa.contador_ultima_leitura} disabled fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField label="Contador Atual" type="number" value={contadorAtual} onChange={e => setContadorAtual(e.target.value)} fullWidth autoFocus />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField label="Desconto (FICHAS)" type="number" value={descontoFichas} onChange={e => setDescontoFichas(e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField label="Valor Pago (R$)" type="number" value={valorPago} onChange={e => setValorPago(e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button variant="contained" size="large" onClick={handleSalvarLeitura} fullWidth sx={{ height: '100%' }}>Salvar Leitura</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 500, mb: 2, ml: 1 }}>Histórico de Leituras</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Cont. Anterior</TableCell>
                                <TableCell>Cont. Atual</TableCell>
                                <TableCell>Fichas Brutas</TableCell>
                                <TableCell>Desc. Fichas</TableCell>
                                <TableCell>Valor Cobrado</TableCell>
                                <TableCell>Valor Pago</TableCell>
                                <TableCell>Dívida Restante</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historico.map(leitura => (
                                <TableRow key={leitura.id} hover>
                                    <TableCell>{format(parseISO(leitura.data_leitura), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{leitura.contador_anterior}</TableCell>
                                    <TableCell>{leitura.contador_atual_na_visita}</TableCell>
                                    <TableCell>{leitura.fichas_brutas}</TableCell>
                                    <TableCell>{leitura.desconto_fichas}</TableCell>
                                    <TableCell>R$ {parseFloat(leitura.valor_cobrado).toFixed(2)}</TableCell>
                                    <TableCell>R$ {parseFloat(leitura.valor_pago).toFixed(2)}</TableCell>
                                    <TableCell sx={{ color: parseFloat(leitura.divida_restante) > 0 ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
                                        R$ {parseFloat(leitura.divida_restante).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default MesaDetailPage;