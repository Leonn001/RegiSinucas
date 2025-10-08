// src/components/MesaForm.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TextField, Button, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';

function MesaForm({ clientes, cidades, onMesaCriada, fecharModal }) {
    // Estados para todos os campos do formulário
    const [numeroSerie, setNumeroSerie] = useState('');
    const [nomePontoComercial, setNomePontoComercial] = useState('');
    const [endereco, setEndereco] = useState('');
    const [valorFicha, setValorFicha] = useState('');
    const [contadorInicial, setContadorInicial] = useState('');
    const [clienteId, setClienteId] = useState('');

    // Estados para a lógica de cascata
    const [cidadeId, setCidadeId] = useState('');
    const [distritos, setDistritos] = useState([]);
    const [distritoId, setDistritoId] = useState('');

    useEffect(() => {
        if (cidadeId) {
            api.get(`/cidades/${cidadeId}/distritos`).then(response => {
                setDistritos(response.data);
            });
        } else {
            setDistritos([]);
        }
    }, [cidadeId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const mesaData = {
            numero_serie: numeroSerie,
            nome_ponto_comercial: nomePontoComercial,
            endereco_completo: endereco,
            valor_ficha_padrao: parseFloat(valorFicha),
            contador_ultima_leitura: parseInt(contadorInicial),
            cliente_id: clienteId,
            distrito_id: distritoId,
            status: 'Ativa',
        };

        try {
            const response = await api.post('/mesas', mesaData);
            onMesaCriada(response.data);
            fecharModal();
        } catch (error) {
            alert('Erro ao criar mesa: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>Adicionar Nova Mesa</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Nº de Série" value={numeroSerie} onChange={e => setNumeroSerie(e.target.value)} fullWidth required variant="standard" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel>Cliente Responsável</InputLabel>
                            <Select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
                                {clientes.map(cliente => (
                                    <MenuItem key={cliente.id} value={cliente.id}>{cliente.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Nome do Ponto Comercial" value={nomePontoComercial} onChange={e => setNomePontoComercial(e.target.value)} fullWidth required variant="standard" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel>Cidade</InputLabel>
                            <Select value={cidadeId} onChange={e => setCidadeId(e.target.value)} required>
                                {cidades.map(cidade => (
                                    <MenuItem key={cidade.id} value={cidade.id}>{cidade.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="standard" disabled={!cidadeId}>
                            <InputLabel>Distrito</InputLabel>
                            <Select value={distritoId} onChange={e => setDistritoId(e.target.value)} required>
                                {distritos.map(distrito => (
                                    <MenuItem key={distrito.id} value={distrito.id}>{distrito.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Endereço Completo" value={endereco} onChange={e => setEndereco(e.target.value)} fullWidth required variant="standard" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Valor da Ficha (ex: 2.50)" type="number" value={valorFicha} onChange={e => setValorFicha(e.target.value)} fullWidth required variant="standard" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Contador Inicial" type="number" value={contadorInicial} onChange={e => setContadorInicial(e.target.value)} fullWidth required variant="standard" />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={fecharModal}>Cancelar</Button>
                <Button type="submit" variant="contained">Adicionar Mesa</Button>
            </DialogActions>
        </form>
    );
}

export default MesaForm;