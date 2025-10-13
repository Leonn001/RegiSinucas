const { Cidade, Distrito } = require('../database/index').connection.models;

class CidadeService {
    async create(cidadeData) {
        const cidade = await Cidade.create(cidadeData);
        return cidade;
    }

    async findAll() {
        const cidades = await Cidade.findAll({
            include: [{
                model: Distrito,
                as: 'distritos',
                attributes: ['id', 'nome', 'cidade_id'],
                order: [['nome', 'ASC']]
            }],
            order: [['nome', 'ASC']]
        });

        return cidades;
    }

    async findById(id) {
        const cidade = await Cidade.findByPk(id, {
            include: [{
                model: Distrito,
                as: 'distritos',
                attributes: ['id', 'nome', 'cidade_id']
            }]
        });
        return cidade;
    }
}

module.exports = new CidadeService();
