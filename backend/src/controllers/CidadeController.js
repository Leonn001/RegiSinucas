const CidadeService = require('../services/CidadeService');

class CidadeController {
    async store(req, res) {
        try {
            const cidade = await CidadeService.create(req.body);
            return res.status(201).json(cidade);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async index(req, res) {
        try {
            const cidades = await CidadeService.findAll();
            return res.json(cidades);
        } catch (error) { /* ...código de erro... */ }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            const cidade = await CidadeService.findById(id);
            if (!cidade) {
                return res.status(404).json({ error: 'Cidade não encontrada.' });
            }
            return res.json(cidade);
        } catch (error) { /* ...código de erro... */ }
    }
}
module.exports = new CidadeController();