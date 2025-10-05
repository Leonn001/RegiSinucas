const { Distrito } = require('../database/index').connection.models;

class DistritoService {
    async create(distritoData) {
        const distrito = await Distrito.create(distritoData);
        return distrito;
    }
    async findAll() {
        const distritos = await Distrito.findAll();
        return distritos;
    }
    async findById(id) {
        const distrito = await Distrito.findByPk(id);
        return distrito;
    }
    async findByCidade(cidadeId) {
        const distritos = await Distrito.findAll({
            where: { cidade_id: cidadeId }
        });
        return distritos;
    }
}
module.exports = new DistritoService();