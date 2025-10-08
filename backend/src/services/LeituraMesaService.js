const { LeituraMesa, Mesa } = require('../database/index').connection.models;

class LeituraMesaService {
    async create(leituraData) {
        const {
            mesa_id,
            contador_atual_na_visita,
            desconto_fichas = 0,
            valor_pago_dinheiro = 0,
            valor_pago_pix = 0
        } = leituraData;

        const mesa = await Mesa.findByPk(mesa_id);
        if (!mesa) {
            throw new Error('Mesa não encontrada.');
        }
        if (parseInt(contador_atual_na_visita) < mesa.contador_ultima_leitura) {
            throw new Error('O contador atual não pode ser menor que o último contador.');
        }

        const fichas_brutas = parseInt(contador_atual_na_visita) - mesa.contador_ultima_leitura;
        const fichas_liquidas = fichas_brutas - parseInt(desconto_fichas);
        const valor_total_apurado = fichas_liquidas * parseFloat(mesa.valor_ficha_padrao);
        const valor_cobrado_empresa = valor_total_apurado / 2;
        const total_pago = parseFloat(valor_pago_dinheiro) + parseFloat(valor_pago_pix);
        const divida_restante = valor_cobrado_empresa - total_pago;

        let status_pagamento = divida_restante <= 0 ? 'Pago Integralmente' : (total_pago > 0 ? 'Pagamento Parcial' : 'Aguardando Pagamento');

        const leitura = await LeituraMesa.create({
            data_leitura: new Date(),
            contador_anterior: mesa.contador_ultima_leitura,
            contador_atual_na_visita,
            fichas_brutas,
            desconto_fichas,
            fichas_liquidas,
            valor_total_apurado,
            valor_cobrado_empresa,
            valor_pago_dinheiro,
            valor_pago_pix,
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

            order: [['data_leitura', 'DESC']]

        });

        return leituras;

    }
}

module.exports = new LeituraMesaService();