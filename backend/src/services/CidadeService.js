const { Cidade } = require('../database/index').connection.models;

class CidadeService {
    async create(cidadeData) {
        const cidade = await Cidade.create(cidadeData);
        return cidade;
    }
    async findAll() {
        const cidades = await Cidade.findAll();
        return cidades;
    }
    async findById(id) {
        const cidade = await Cidade.findByPk(id);
        return cidade;
    }
}
module.exports = new CidadeService();