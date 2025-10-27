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
        } catch (error) { }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            const cliente = await ClienteService.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrada.' });
            }
            return res.json(cliente);
        } catch (error) { }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const cliente = await ClienteService.update(id, req.body);
            return res.json(cliente);
        } catch (error) {
            if (error.message === 'Cliente não encontrado.') {
                return res.status(404).json({ error: error.message });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await ClienteService.delete(id);
            return res.status(204).send();
        } catch (error) {
            if (error.message === 'Cliente não encontrado.') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Não é possível excluir cliente que possui mesas ativas.') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ClienteController();