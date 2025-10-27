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
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await LeituraMesaService.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new LeituraMesaController();