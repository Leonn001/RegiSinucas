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

    async show(req, res) {
        try {
            const { id } = req.params;
            const mesa = await MesaService.findById(id);
            if (!mesa) {
                return res.status(404).json({ error: 'Mesa não encontrada.' });
            }
            return res.json(mesa);
        } catch (error) { }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const mesa = await MesaService.update(id, req.body);
            return res.json(mesa);
        } catch (error) {
            if (error.message === 'Mesa não encontrada.') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await MesaService.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async inativar(req, res) {
        try {
            const { id } = req.params;
            await MesaService.inativar(id);

            return res.status(200).json({ message: 'Mesa inativada e movida para o Galpão com sucesso.' });

        } catch (error) {
            if (error.message === 'Mesa não encontrada.' || error.message === 'Esta mesa já está inativa.') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Galpão não encontrado')) {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno ao inativar a mesa: ' + error.message });
        }
    }
}

module.exports = new MesaController();