const MesaService = require('../services/MesaService');

class MesaController {
    async store(req, res) {
        try {
            const mesaData = req.body;
            const mesa = await MesaService.create(mesaData);

            return res.status(201).json(mesa);

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async index(req, res) {
        try {
            const mesas = await MesaService.findAll();
            return res.json(mesas);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    async devolver(req, res) {
        try {
            const { id } = req.params;
            const mesa = await MesaService.devolver(id);
            return res.json(mesa);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new MesaController();