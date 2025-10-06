// src/components/CidadeForm.js
import React, { useState } from 'react';
import api from '../services/api';

function CidadeForm({ onCidadeCriada, fecharModal }) {
    const [nome, setNome] = useState('');
    const [estado, setEstado] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!nome || !estado) return alert('Preencha todos os campos!');

        try {
            const response = await api.post('/cidades', { nome, estado });
            onCidadeCriada(response.data); // Avisa o pai que a cidade foi criada
            fecharModal(); // Pede ao pai para fechar o modal
        } catch (error) {
            console.error("Erro ao criar cidade:", error);
            alert('Erro ao criar cidade.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Adicionar Nova Cidade</h2>
            <p>Insira o nome da nova cidade e o seu estado.</p>

            <label htmlFor="nome">Nome da Cidade</label>
            <input
                id="nome"
                type="text"
                placeholder="Ex: Salvador"
                value={nome}
                onChange={e => setNome(e.target.value)}
            />

            <label htmlFor="estado">Estado</label>
            <input
                id="estado"
                type="text"
                placeholder="Ex: BA"
                maxLength="2"
                value={estado}
                onChange={e => setEstado(e.target.value)}
            />

            <div className="modal-actions">
                <button type="button" className="button-secondary" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="button-primary">Adicionar</button>
            </div>
        </form>
    );
}

export default CidadeForm;