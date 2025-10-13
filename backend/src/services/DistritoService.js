const { Distrito, Cidade } = require('../database/index').connection.models;

class DistritoService {
    async create(distritoData) {
        const distrito = await Distrito.create(distritoData);
        return distrito;
    }

    async findAll() {
        const distritos = await Distrito.findAll({
            include: [
                { model: Cidade, as: 'cidade', attributes: ['id', 'nome', 'estado'] }
            ]
        });
        return distritos;
    }

    async findById(id) {
        const distrito = await Distrito.findByPk(id, {
            include: [
                { model: Cidade, as: 'cidade', attributes: ['id', 'nome', 'estado'] }
            ]
        });
        return distrito;
    }

    async findByCidade(cidadeId) {
        const distritos = await Distrito.findAll({
            where: { cidade_id: cidadeId },
            include: [
                { model: Cidade, as: 'cidade', attributes: ['id', 'nome', 'estado'] }
            ]
        });
        return distritos;
    }
}

module.exports = new DistritoService();
