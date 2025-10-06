const { Cliente } = require('../database/index').connection.models;

class ClienteService {
    async create(clienteData) {
        const cliente = await Cliente.create(clienteData);
        return cliente;
    }

    async findAll() {
        const clientes = await Cliente.findAll();
        return clientes;
    }

    async findById(id) {
        const cliente = await Cliente.findByPk(id);
        return cliente;
    }
}

module.exports = new ClienteService();