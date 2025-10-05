const { LeituraMesa, Mesa } = require('../database/index').connection.models;

class LeituraMesaService {
    async create(leituraData) {
        const { mesa_id, contador_atual_na_visita, desconto_aplicado = 0, valor_pago_dinheiro = 0, valor_pago_pix = 0 } = leituraData;

        const mesa = await Mesa.findByPk(mesa_id);
        if (!mesa) {
            throw new Error('Mesa não encontrada.');
        }

        // 2. Realizar os cálculos financeiros
        const fichas_rodadas_no_mes = contador_atual_na_visita - mesa.contador_ultima_leitura;
        const valor_apurado_total = fichas_rodadas_no_mes * mesa.valor_ficha_padrao;
        const valor_apurado_empresa = valor_apurado_total / 2;
        const valor_apurado_parceiro = valor_apurado_total / 2;

        const valor_devido_empresa = valor_apurado_empresa - desconto_aplicado;
        const total_pago = valor_pago_dinheiro + valor_pago_pix;
        const divida_restante = valor_devido_empresa - total_pago;

        // 3. Determinar o status do pagamento
        let status_pagamento = 'Aguardando Pagamento';
        if (divida_restante <= 0) {
            status_pagamento = 'Pago Integralmente';
        } else if (total_pago > 0) {
            status_pagamento = 'Pagamento Parcial';
        }

        const leitura = await LeituraMesa.create({
            data_leitura: new Date(),
            contador_anterior: mesa.contador_ultima_leitura,
            contador_atual_na_visita,
            fichas_rodadas_no_mes,
            valor_apurado_empresa,
            valor_apurado_parceiro,
            desconto_aplicado,
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
}

module.exports = new LeituraMesaService();