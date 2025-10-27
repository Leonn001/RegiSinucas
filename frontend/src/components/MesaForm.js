// src/components/MesaForm.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TextField, Button, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';

function MesaForm({ clientes, cidades, mesaParaEditar, onMesaSalva, fecharModal }) {

    const [numeroSerie, setNumeroSerie] = useState('');
    const [nomePontoComercial, setNomePontoComercial] = useState('');
    const [endereco, setEndereco] = useState('');
    const [valorFicha, setValorFicha] = useState('');
    const [contadorInicial, setContadorInicial] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [cidadeId, setCidadeId] = useState('');
    const [distritos, setDistritos] = useState([]);
    const [distritoId, setDistritoId] = useState('');

    const isEditing = !!mesaParaEditar;
    const tituloModal = isEditing ? 'Editar Mesa' : 'Adicionar Nova Mesa';

    useEffect(() => {
        if (cidadeId) {
            setDistritoId('');
            api.get(`/cidades/${cidadeId}/distritos`).then(response => {
                setDistritos(response.data);

                if (isEditing && mesaParaEditar.distrito_id && mesaParaEditar.distrito.cidade_id === cidadeId) {
                    setDistritoId(mesaParaEditar.distrito_id);
                }
            });
        } else {
            setDistritos([]);
        }
    }, [cidadeId, isEditing, mesaParaEditar]);

    useEffect(() => {
        if (isEditing) {
            setNumeroSerie(mesaParaEditar.numero_serie);
            setNomePontoComercial(mesaParaEditar.nome_ponto_comercial);
            setEndereco(mesaParaEditar.endereco_completo);
            setValorFicha(mesaParaEditar.valor_ficha_padrao);
            setContadorInicial(mesaParaEditar.contador_ultima_leitura);
            setClienteId(mesaParaEditar.cliente_id);

            if (mesaParaEditar.distrito) {
                setCidadeId(mesaParaEditar.distrito.cidade_id);
                setDistritoId(mesaParaEditar.distrito_id);
            }
        } else {
            setNumeroSerie('');
            setNomePontoComercial('');
            setEndereco('');
            setValorFicha('');
            setContadorInicial('');
            setClienteId('');
            setCidadeId('');
            setDistritoId('');
        }
    }, [mesaParaEditar, isEditing]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const mesaData = {
            numero_serie: numeroSerie,
            nome_ponto_comercial: nomePontoComercial,
            endereco_completo: endereco,
            valor_ficha_padrao: parseFloat(valorFicha),
            cliente_id: clienteId,
            distrito_id: distritoId,
        };

        if (!isEditing) {
            mesaData.contador_ultima_leitura = parseInt(contadorInicial);
            mesaData.status = 'Ativa';
        }

        try {
            if (isEditing) {
                await api.put(`/mesas/${mesaParaEditar.id}`, mesaData);
            } else {
                await api.post('/mesas', mesaData);
            }
            onMesaSalva();

        } catch (error) {
            alert('Erro ao salvar mesa: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>{tituloModal}</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus margin="dense" label="Nº de Série"
                    value={numeroSerie} onChange={e => setNumeroSerie(e.target.value)}
                    fullWidth required variant="standard"
                    disabled={isEditing}
                />

                <FormControl fullWidth variant="standard" sx={{ mt: 2, mb: 1 }}>
                    <InputLabel>Cliente Responsável</InputLabel>
                    <Select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
                        {clientes.map(cliente => (
                            <MenuItem key={cliente.id} value={cliente.id}>{cliente.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    margin="dense" label="Nome do Ponto Comercial"
                    value={nomePontoComercial} onChange={e => setNomePontoComercial(e.target.value)}
                    fullWidth required variant="standard"
                />

                <Grid container spacing={2} sx={{ mt: 1, mb: 0 }}>
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
                </Grid>

                <TextField
                    margin="dense" label="Endereço Completo"
                    value={endereco} onChange={e => setEndereco(e.target.value)}
                    fullWidth required variant="standard"
                />

                <TextField
                    margin="dense" label="Valor da Ficha (ex: 2.50)" type="number"
                    value={valorFicha} onChange={e => setValorFicha(e.target.value)}
                    fullWidth required variant="standard"
                />

                {!isEditing && (
                    <TextField
                        margin="dense" label="Contador Inicial" type="number"
                        value={contadorInicial} onChange={e => setContadorInicial(e.target.value)}
                        fullWidth required variant="standard"
                    />
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={fecharModal}>Cancelar</Button>
                <Button type="submit" variant="contained">Salvar</Button>
            </DialogActions>
        </form>
    );
}

export default MesaForm;