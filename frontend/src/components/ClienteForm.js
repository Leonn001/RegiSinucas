// src/components/ClienteForm.js (VERSÃO INTELIGENTE)

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ClienteForm({ cidades, onClienteCriado, fecharModal }) {
    // Estados para os campos do formulário
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    // Estados para a lógica de cascata
    const [cidadeIdSelecionada, setCidadeIdSelecionada] = useState('');
    const [distritos, setDistritos] = useState([]);
    const [distritoId, setDistritoId] = useState('');

    // EFEITO: Busca os distritos sempre que uma cidade for selecionada
    useEffect(() => {
        if (cidadeIdSelecionada) {
            api.get(`/cidades/${cidadeIdSelecionada}/distritos`)
                .then(response => {
                    setDistritos(response.data);
                });
        } else {
            setDistritos([]); // Limpa a lista de distritos se nenhuma cidade for selecionada
        }
    }, [cidadeIdSelecionada]); // <-- O gatilho é a mudança da cidade

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!nome || !telefone || !distritoId) {
            return alert('Preencha todos os campos!');
        }
        try {
            const response = await api.post('/clientes', { nome, telefone, distrito_id: distritoId });
            onClienteCriado(response.data);
            fecharModal();
        } catch (error) {
            alert('Erro ao criar cliente: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Adicionar Novo Cliente</h2>

            <label htmlFor="nome">Nome do Cliente</label>
            <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} />

            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" type="text" value={telefone} onChange={e => setTelefone(e.target.value)} />

            <label htmlFor="cidade">Cidade de Residência</label>
            <select id="cidade" value={cidadeIdSelecionada} onChange={e => setCidadeIdSelecionada(e.target.value)}>
                <option value="">Selecione uma cidade</option>
                {cidades.map(cidade => (
                    <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
                ))}
            </select>

            <label htmlFor="distrito">Distrito de Residência</label>
            <select id="distrito" value={distritoId} onChange={e => setDistritoId(e.target.value)} disabled={!cidadeIdSelecionada}>
                <option value="">Selecione um distrito</option>
                {distritos.map(distrito => (
                    <option key={distrito.id} value={distrito.id}>{distrito.nome}</option>
                ))}
            </select>

            <div className="modal-actions">
                <button type="button" className="button-secondary" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="button-primary">Adicionar</button>
            </div>
        </form>
    );
}

export default ClienteForm;