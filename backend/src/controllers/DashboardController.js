// src/controllers/DashboardController.js
'use strict';
const DashboardService = require('../services/DashboardService');

class DashboardController {
    async index(req, res) {
        try {
            // Usamos Promise.all para buscar todos os dados do dashboard em paralelo
            const [kpis, lucroPorCidade] = await Promise.all([
                DashboardService.getKpis(),
                DashboardService.getLucroPorCidade(),
            ]);

            return res.json({ kpis, lucroPorCidade });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DashboardController();