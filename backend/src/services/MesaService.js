const { Mesa } = require('../database/index').connection.models;

class MesaService {
    async create(mesaData) {
        const { numero_serie } = mesaData;

        const mesaExists = await Mesa.findOne({
            where: { numero_serie: numero_serie }
        });

        if (mesaExists) {
            throw new Error('Número de série já cadastrado.');
        }

        const mesa = await Mesa.create(mesaData);

        return mesa;
    }

    async findAll() {
        const mesas = await Mesa.findAll();
        return mesas;
    }

    async devolver(id) {
        const mesa = await Mesa.findByPk(id);
        if (!mesa) {
            throw new Error('Mesa não encontrada.');
        }

        mesa.status = 'Inativa - Galpão';
        mesa.cliente_id = null;

        await mesa.save();

        return mesa;
    }
}

module.exports = new MesaService();