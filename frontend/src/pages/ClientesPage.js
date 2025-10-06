// src/pages/ClientesPage.js (VERSÃO FINAL COM MODAL)

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // [NOVO] Importamos a biblioteca do Modal
import api from '../services/api';
import ClienteForm from '../components/ClienteForm'; // [NOVO] Importamos o nosso formulário

Modal.setAppElement('#root'); // [NOVO] Configuração de acessibilidade

function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [distritos, setDistritos] = useState([]); // [NOVO] O form precisa da lista completa de distritos

    const [modalIsOpen, setModalIsOpen] = useState(false); // [NOVO] Estado para controlar o modal

    useEffect(() => {
        // Usamos Promise.all para carregar tudo o que a página precisa
        Promise.all([
            api.get('/clientes'),
            api.get('/cidades'),
            api.get('/distritos') // [NOVO] Buscamos os distritos para o formulário
        ]).then(([clientesResponse, cidadesResponse, distritosResponse]) => {
            setClientes(clientesResponse.data);
            setCidades(cidadesResponse.data);
            setDistritos(distritosResponse.data);
        }).catch(error => {
            console.error("Erro ao buscar dados iniciais:", error);
        });
    }, []);

    // [NOVO] Funções para controlar o modal
    const abrirModal = () => setModalIsOpen(true);
    const fecharModal = () => setModalIsOpen(false);

    // [ALTERADO] Função de callback atualizada
    const handleClienteCriado = (novoCliente) => {
        // Para ter os dados completos (com distrito e cidade), o melhor é recarregar a lista
        api.get('/clientes').then(response => setClientes(response.data));
        fecharModal(); // Fecha o modal após o sucesso
    };

    // Função "ajudante" para encontrar os nomes das localizações
    const getLocationNames = (distritoId) => {
        if (!distritoId || distritos.length === 0 || cidades.length === 0) return 'Não informado';
        const distrito = distritos.find(d => d.id === distritoId);
        if (!distrito) return 'Distrito não encontrado';
        const cidade = cidades.find(c => c.id === distrito.cidade_id);
        return distrito && cidade ? `${distrito.nome} - ${cidade.nome}` : 'Carregando...';
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Gestão de Clientes</h2>
                {/* [ALTERADO] O botão agora abre o modal */}
                <button onClick={abrirModal} className="button-primary">+ Adicionar Cliente</button>
            </div>

            <hr />

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'center', padding: '8px' }}>Nome</th>
                    <th style={{ textAlign: 'center', padding: '8px' }}>Telefone</th>
                    <th style={{ textAlign: 'center', padding: '8px' }}>Localização</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map(cliente => (
                    <tr key={cliente.id} style={{ borderBottom: '1.5px solid #eee' }}>
                        <td style={{ padding: '8px' }}>{cliente.nome}</td>
                        <td style={{ padding: '8px' }}>{cliente.telefone}</td>
                        <td style={{ padding: '8px' }}>
                            {getLocationNames(cliente.distrito_id)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={fecharModal}
                contentLabel="Adicionar Novo Cliente"
                className="modal"
                overlayClassName="overlay"
            >
                <ClienteForm
                    cidades={cidades} // Passamos a lista de cidades para o form
                    onClienteCriado={handleClienteCriado}
                    fecharModal={fecharModal}
                />
            </Modal>
        </div>
    );
}

export default ClientesPage;