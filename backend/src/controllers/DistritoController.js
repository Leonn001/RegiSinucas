const DistritoService = require('../services/DistritoService');

class DistritoController {
    async store(req, res) {
        try {
            const distrito = await DistritoService.create(req.body);
            return res.status(201).json(distrito);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async index(req, res) {
        try {
            const distritos = await DistritoService.findAll();
            return res.json(distritos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const distrito = await DistritoService.findById(id);

            if (!distrito) {
                return res.status(404).json({ error: 'Distrito não encontrado.' });
            }

            return res.json(distrito);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    async indexByCidade(req, res) {
        try {
            const { cidadeId } = req.params; // Pega o ID da cidade a partir da URL
            const distritos = await DistritoService.findByCidade(cidadeId);
            return res.json(distritos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar distritos da cidade.' });
        }
    }
}

module.exports = new DistritoController();