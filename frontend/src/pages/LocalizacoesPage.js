// src/pages/LocalizacoesPage.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // [1] Importamos a biblioteca do Modal
import api from '../services/api';
import CidadeForm from '../components/CidadeForm'; // [2] Importamos nossos formulários
import DistritoForm from '../components/DistritoForm';
import './LocalizacoesPage.css';

Modal.setAppElement('#root'); // Configuração de acessibilidade para o Modal

function LocalizacoesPage() {
    const [cidades, setCidades] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState(null);

    // [3] Estados para controlar a visibilidade de cada modal
    const [modalCidadeIsOpen, setModalCidadeIsOpen] = useState(false);
    const [modalDistritoIsOpen, setModalDistritoIsOpen] = useState(false);

    // ... useEffect para buscar cidades (sem alterações) ...
    useEffect(() => {
        api.get('/cidades').then(response => {
            setCidades(response.data);
        });
    }, []);

    // ... useEffect para buscar distritos (sem alterações) ...
    useEffect(() => {
        if (cidadeSelecionada) {
            api.get(`/cidades/${cidadeSelecionada.id}/distritos`).then(response => {
                setDistritos(response.data);
            });
        }
    }, [cidadeSelecionada]);

    const handleCidadeClick = (cidade) => {
        // Se a cidade que foi clicada já for a que está selecionada, não faz nada.
        if (cidadeSelecionada && cidade.id === cidadeSelecionada.id) {
            return; // Simplesmente sai da função
        }

        // Só se for uma cidade diferente, ele continua...
        setCidadeSelecionada(cidade);
        setDistritos([]); // Limpa a lista para dar feedback de carregamento
    };

    // [4] Funções para abrir e fechar os modais
    const abrirModalCidade = () => setModalCidadeIsOpen(true);
    const fecharModalCidade = () => setModalCidadeIsOpen(false);

    const abrirModalDistrito = () => setModalDistritoIsOpen(true);
    const fecharModalDistrito = () => setModalDistritoIsOpen(false);

    // [5] Funções de callback para quando um item é criado
    const handleCidadeCriada = (novaCidade) => {
        setCidades([...cidades, novaCidade]);
        fecharModalCidade(); // Fecha o modal após o sucesso
    };

    const handleDistritoCriado = (novoDistrito) => {
        if (cidadeSelecionada && novoDistrito.cidade_id === cidadeSelecionada.id) {
            setDistritos([...distritos, novoDistrito]);
        }
        fecharModalDistrito(); // Fecha o modal após o sucesso
    };

    return (
        <div className="localizacoes-container">
            <h2>Gestão de Localizações</h2>
            <div className="panels-container">
                {/* Painel da Esquerda: Cidades */}
                <div className="panel">
                    <div className="panel-header">
                        <h3>Cidades</h3>
                        {/* [6] Botão para abrir o modal de cidade */}
                        <button onClick={abrirModalCidade} className="button-primary">+ Adicionar Cidade</button>
                    </div>
                    <ul className="list">
                        {cidades.map(cidade => (
                            <li
                                key={cidade.id}
                                onClick={() => handleCidadeClick(cidade)}
                                className={cidadeSelecionada && cidade.id === cidadeSelecionada.id ? 'selected' : ''}
                            >
                                {cidade.nome} - {cidade.estado}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Painel da Direita: Distritos */}
                <div className="panel">
                    <div className="panel-header">
                        <h3>Distritos de {cidadeSelecionada ? cidadeSelecionada.nome : '...'}</h3>
                        {/* [7] Botão para abrir o modal de distrito */}
                        <button onClick={abrirModalDistrito} className="button-primary">+ Adicionar Distrito</button>
                    </div>
                    <ul className="list">
                        {distritos.map(distrito => (
                            <li key={distrito.id}>
                                {distrito.nome}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* [8] Componente Modal para Cidades (fica "invisível" até ser aberto) */}
            <Modal
                isOpen={modalCidadeIsOpen}
                onRequestClose={fecharModalCidade}
                contentLabel="Adicionar Nova Cidade"
                className="modal"
                overlayClassName="overlay"
            >
                <CidadeForm onCidadeCriada={handleCidadeCriada} fecharModal={fecharModalCidade} />
            </Modal>

            {/* [9] Componente Modal para Distritos */}
            <Modal
                isOpen={modalDistritoIsOpen}
                onRequestClose={fecharModalDistrito}
                contentLabel="Adicionar Novo Distrito"
                className="modal"
                overlayClassName="overlay"
            >
                <DistritoForm cidades={cidades} onDistritoCriado={handleDistritoCriado} fecharModal={fecharModalDistrito} />
            </Modal>
        </div>
    );
}

export default LocalizacoesPage;