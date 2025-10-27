const { LeituraMesa, Mesa, Cliente, Distrito, Cidade } = require('../database/index').connection.models;
const { parseISO } = require('date-fns');

class LeituraMesaService {

    async create(leituraData) {
        const {
            mesa_id,
            contador_atual_na_visita,
            desconto_fichas = 0,
            valor_pago = 0,
            data_leitura
        } = leituraData;

        const mesa = await Mesa.findByPk(mesa_id);
        if (!mesa) throw new Error('Mesa não encontrada.');
        if (parseInt(contador_atual_na_visita) < mesa.contador_ultima_leitura) {
            throw new Error('O contador atual não pode ser menor que o último contador.');
        }

        const fichas_brutas = parseInt(contador_atual_na_visita) - mesa.contador_ultima_leitura;
        const fichas_liquidas = fichas_brutas - parseInt(desconto_fichas);
        const valor_total_apurado = fichas_liquidas * parseFloat(mesa.valor_ficha_padrao);
        const valor_cobrado = valor_total_apurado / 2;
        const divida_restante = valor_cobrado - parseFloat(valor_pago);

        let status_pagamento = divida_restante <= 0 ? 'Pago Integralmente' : (valor_pago > 0 ? 'Pagamento Parcial' : 'Aguardando Pagamento');

        const dataCorreta = data_leitura ? parseISO(data_leitura) : new Date();

        const leitura = await LeituraMesa.create({
            data_leitura: dataCorreta,
            contador_anterior: mesa.contador_ultima_leitura,
            contador_atual_na_visita,
            fichas_brutas,
            desconto_fichas: parseInt(desconto_fichas),
            valor_cobrado,
            valor_pago: parseFloat(valor_pago),
            divida_restante,
            status_pagamento,
            mesa_id,
        });

        mesa.contador_ultima_leitura = contador_atual_na_visita;
        await mesa.save();

        return leitura;
    }

    async findByMesaId(mesaId) {
        const leituras = await LeituraMesa.findAll({
            where: { mesa_id: mesaId },
            order: [['data_leitura', 'DESC']],
            include: [
                {
                    model: Mesa,
                    as: 'mesa',
                    attributes: ['id', 'numero_serie', 'nome_ponto_comercial', 'valor_ficha_padrao', 'contador_ultima_leitura'],
                    include: [
                        { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
                        {
                            model: Distrito,
                            as: 'distrito',
                            attributes: ['id', 'nome'],
                            include: [
                                { model: Cidade, as: 'cidade', attributes: ['id', 'nome', 'estado'] }
                            ]
                        }
                    ]
                }
            ]
        });

        return leituras;
    }

    async delete(id) {
        try {
            const leituraParaExcluir = await LeituraMesa.findByPk(id);
            if (!leituraParaExcluir) {
                throw new Error('Leitura não encontrada.');
            }

            const { mesa_id, contador_anterior } = leituraParaExcluir;

            const mesa = await Mesa.findByPk(mesa_id);
            if (!mesa) throw new Error('Mesa associada não encontrada.');

            if (mesa.contador_ultima_leitura !== leituraParaExcluir.contador_atual_na_visita) {
                throw new Error('Apenas a leitura mais recente pode ser excluída.');
            }

            await leituraParaExcluir.destroy();

            await mesa.update({
                contador_ultima_leitura: contador_anterior
            });

            return true;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LeituraMesaService();
