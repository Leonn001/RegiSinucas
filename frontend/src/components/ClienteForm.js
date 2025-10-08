// src/components/ClienteForm.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TextField, Button, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function ClienteForm({ cidades, onClienteCriado, fecharModal }) {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cidadeIdSelecionada, setCidadeIdSelecionada] = useState('');
    const [distritos, setDistritos] = useState([]);
    const [distritoId, setDistritoId] = useState('');

    useEffect(() => {
        if (cidadeIdSelecionada) {
            api.get(`/cidades/${cidadeIdSelecionada}/distritos`).then(response => {
                setDistritos(response.data);
            });
        } else {
            setDistritos([]);
        }
    }, [cidadeIdSelecionada]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!nome || !telefone || !distritoId) return alert('Preencha todos os campos!');
        try {
            const response = await api.post('/clientes', { nome, telefone, distrito_id: distritoId });
            onClienteCriado(response.data);
            fecharModal();
        } catch (error) { }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Nome do Cliente"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="telefone"
                    label="Telefone"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={telefone}
                    onChange={e => setTelefone(e.target.value)}
                />
                <FormControl fullWidth variant="standard" sx={{ mt: 2, mb: 1 }}>
                    <InputLabel id="cidade-select-label">Cidade de Residência</InputLabel>
                    <Select
                        labelId="cidade-select-label"
                        value={cidadeIdSelecionada}
                        onChange={e => setCidadeIdSelecionada(e.target.value)}
                    >
                        {cidades.map(cidade => (
                            <MenuItem key={cidade.id} value={cidade.id}>{cidade.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="standard" sx={{ mt: 2, mb: 1 }} disabled={!cidadeIdSelecionada}>
                    <InputLabel id="distrito-select-label">Distrito de Residência</InputLabel>
                    <Select
                        labelId="distrito-select-label"
                        value={distritoId}
                        onChange={e => setDistritoId(e.target.value)}
                    >
                        {distritos.map(distrito => (
                            <MenuItem key={distrito.id} value={distrito.id}>{distrito.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={fecharModal}>Cancelar</Button>
                <Button type="submit" variant="contained">Adicionar</Button>
            </DialogActions>
        </form>
    );
}

export default ClienteForm;