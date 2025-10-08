const LeituraMesaService = require('../services/LeituraMesaService');

class LeituraMesaController {
    async store(req, res) {
        try {
            const leitura = await LeituraMesaService.create(req.body);
            return res.status(201).json(leitura);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async indexByMesa(req, res) {
        try {
            const { mesaId } = req.params;
            const leituras = await LeituraMesaService.findByMesaId(mesaId);
            return res.json(leituras);
        } catch (error) { /* ...código de erro... */ }
    }
}

module.exports = new LeituraMesaController();