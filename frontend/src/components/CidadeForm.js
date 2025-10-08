// src/components/CidadeForm.js

import React, { useState } from 'react';
import api from '../services/api';
import { TextField, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function CidadeForm({ onCidadeCriada, fecharModal }) {
    const [nome, setNome] = useState('');
    const [estado, setEstado] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!nome || !estado) return alert('Preencha todos os campos!');
        try {
            const response = await api.post('/cidades', { nome, estado });
            onCidadeCriada(response.data);
            fecharModal();
        } catch (error) { /* ...código de erro... */ }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>Adicionar Nova Cidade</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Insira o nome da nova cidade e o seu estado.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="nome"
                    label="Nome da Cidade"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="estado"
                    label="Estado (ex: BA)"
                    type="text"
                    fullWidth
                    variant="standard"
                    inputProps={{ maxLength: 2 }}
                    value={estado}
                    onChange={e => setEstado(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fecharModal}>Cancelar</Button>
                <Button type="submit" variant="contained">Adicionar</Button>
            </DialogActions>
        </form>
    );
}

export default CidadeForm;