// src/controllers/DashboardController.js
'use strict';
const DashboardService = require('../services/DashboardService');

class DashboardController {
    async index(req, res) {
        try {
            const ano = req.query.ano ? parseInt(req.query.ano) : undefined;
            const mes = req.query.mes ? parseInt(req.query.mes) : undefined;

            const [kpis, lucroPorCidade] = await Promise.all([
                DashboardService.getKpis(),
                DashboardService.getLucroPorCidade({ ano, mes }),
            ]);

            return res.json({ kpis, lucroPorCidade });
        } catch (error) {
            console.error('Erro no DashboardController:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async lucroPorDistrito(req, res) {
        try {
            const { cidade, ano, mes } = req.query;
            const resultado = await DashboardService.getLucroPorDistrito({ cidade, ano, mes });
            return res.json(resultado);
        } catch (error) {
            console.error('Erro no DashboardController:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DashboardController();