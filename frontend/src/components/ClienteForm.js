// src/components/ClienteForm.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useMask } from '@react-input/mask';
import { TextField, Button, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function ClienteForm({ cidades, clienteParaEditar, onClienteSalvo, fecharModal }) {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cidadeIdSelecionada, setCidadeIdSelecionada] = useState('');
    const [distritos, setDistritos] = useState([]);
    const [distritoId, setDistritoId] = useState('');

    const isEditing = !!clienteParaEditar; // Verifica se estamos editando
    const tituloModal = isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente';

    useEffect(() => {
        if (cidadeIdSelecionada) {
            setDistritoId(''); // Limpa o distritoId anterior
            api.get(`/cidades/${cidadeIdSelecionada}/distritos`).then(response => {
                setDistritos(response.data);

                // Se estiver editando E o distrito pertencer a esta cidade, seleciona ele
                if (isEditing && clienteParaEditar.distrito_id && clienteParaEditar.distrito.cidade_id === cidadeIdSelecionada) {
                    setDistritoId(clienteParaEditar.distrito_id);
                }
            });
        } else {
            setDistritos([]);
        }
    }, [cidadeIdSelecionada, isEditing, clienteParaEditar]);

    useEffect(() => {
        if (isEditing) {
            setNome(clienteParaEditar.nome);
            setTelefone(clienteParaEditar.telefone);

            if (clienteParaEditar.distrito) {
                setCidadeIdSelecionada(clienteParaEditar.distrito.cidade_id);
                setDistritoId(clienteParaEditar.distrito_id);
            }
        } else {
            setNome('');
            setTelefone('');
            setCidadeIdSelecionada('');
            setDistritoId('');
        }
    }, [clienteParaEditar, isEditing]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const telefoneApenasDigitos = telefone.replace(/\D/g, '');
        if (!nome || !telefoneApenasDigitos || !distritoId) return alert('Preencha todos os campos!');

        const dadosCliente = {
            nome,
            telefone: telefoneApenasDigitos,
            distrito_id: distritoId
        };

        try {
            if (isEditing) {
                await api.put(`/clientes/${clienteParaEditar.id}`, dadosCliente);
            } else {
                await api.post('/clientes', dadosCliente);
            }
            onClienteSalvo();

        } catch (error) {
            alert('Erro ao salvar cliente: ' + (error.response?.data?.error || error.message));
        }
    };

    const telefoneSemMascara = telefone.replace(/\D/g, '');
    const mask = telefoneSemMascara.length > 10 ? '(##) #####-####' : '(##) ####-####';
    const telefoneRef = useMask({ mask, replacement: { '#': /\d/ } });

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>{tituloModal}</DialogTitle>
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
                    type="tel"
                    fullWidth
                    variant="standard"
                    value={telefone}
                    inputRef={telefoneRef}
                    onChange={(e) => setTelefone(e.target.value)}
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
                <Button type="submit" variant="contained">Salvar</Button>
            </DialogActions>
        </form>
    );
}

export default ClienteForm;