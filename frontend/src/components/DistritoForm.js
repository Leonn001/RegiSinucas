// src/components/DistritoForm.js

import React, { useState } from 'react';
import api from '../services/api';
import { TextField, Button, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function DistritoForm({ cidades, onDistritoCriado, fecharModal }) {
    const [nome, setNome] = useState('');
    const [cidadeId, setCidadeId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!nome || !cidadeId) return alert('Preencha todos os campos!');
        try {
            const response = await api.post('/distritos', { nome, cidade_id: cidadeId });
            onDistritoCriado(response.data);
            fecharModal();
        } catch (error) {  }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>Adicionar Novo Distrito</DialogTitle>
            <DialogContent>
                <FormControl fullWidth variant="standard" sx={{ mt: 2, mb: 1 }}>
                    <InputLabel id="cidade-select-label">Cidade</InputLabel>
                    <Select
                        labelId="cidade-select-label"
                        id="cidade-select"
                        value={cidadeId}
                        onChange={e => setCidadeId(e.target.value)}
                        label="Cidade"
                    >
                        <MenuItem value=""><em>Selecione uma Cidade</em></MenuItem>
                        {cidades.map(cidade => (
                            <MenuItem key={cidade.id} value={cidade.id}>{cidade.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Nome do Distrito (ou 'Sede')"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fecharModal}>Cancelar</Button>
                <Button type="submit" variant="contained">Adicionar</Button>
            </DialogActions>
        </form>
    );
}

export default DistritoForm;