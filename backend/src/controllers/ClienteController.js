const ClienteService = require('../services/ClienteService');

class ClienteController {
    async store(req, res) {
        try {
            const cliente = await ClienteService.create(req.body);
            return res.status(201).json(cliente);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async index(req, res) {
        try {
            const clientes = await ClienteService.findAll();
            return res.json(clientes);
        } catch (error) { /* ...código de erro... */ }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            const cliente = await ClienteService.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cidade não encontrada.' });
            }
            return res.json(cliente);
        } catch (error) { /* ...código de erro... */ }
    }
}

module.exports = new ClienteController();