import React, { useState } from 'react';
import api from '../services/api';

function DistritoForm({ cidades, onDistritoCriado }) {
    const [nome, setNome] = useState('');
    const [cidadeId, setCidadeId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!nome || !cidadeId) {
            alert('Por favor, selecione uma cidade e preencha o nome do distrito.');
            return;
        }
        try {
            const response = await api.post('/distritos', { nome, cidade_id: cidadeId });
            onDistritoCriado(response.data);
            setNome('');
        } catch (error) {
            console.error('Erro ao criar distrito:', error);
            alert('Não foi possível cadastrar o distrito.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <h4>Cadastrar Novo Distrito/Povoado</h4>
            <select
                value={cidadeId}
                onChange={e => setCidadeId(e.target.value)}
            >
                <option value="">Selecione uma Cidade</option>
                {cidades.map(cidade => (
                    <option key={cidade.id} value={cidade.id}>
                        {cidade.nome}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Nome do Distrito (ou 'Sede')"
                value={nome}
                onChange={e => setNome(e.target.value)}
            />
            <button type="submit " className="button-primary">Salvar Distrito</button>
        </form>
    );
}

export default DistritoForm;