const { Cliente, Distrito, Cidade } = require('../database/index').connection.models;

class ClienteService {
    async create(clienteData) {
        const cliente = await Cliente.create(clienteData);
        return cliente;
    }

    async findAll() {
        const clientes = await Cliente.findAll({
            include: [{
                model: Distrito,
                as: 'distrito',
                attributes: ['id', 'nome'],
                include: [{
                    model: Cidade,
                    as: 'cidade',
                    attributes: ['id', 'nome']
                }]
            }]
        });
        return clientes;
    }

    async findById(id) {
        const cliente = await Cliente.findByPk(id, {
            include: [{
                model: Distrito,
                as: 'distrito',
                attributes: ['id', 'nome'],
                include: [{
                    model: Cidade,
                    as: 'cidade',
                    attributes: ['id', 'nome']
                }]
            }]
        });
        return cliente;
    }
}

module.exports = new ClienteService();
