const { Cliente, Distrito, Cidade, Mesa } = require('../database/index').connection.models;

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
                attributes: ['id', 'nome', 'cidade_id'],
                include: [{
                    model: Cidade,
                    as: 'cidade',
                    attributes: ['id', 'nome']
                }]
            }]
        });
        return cliente;
    }

    async update(id, clienteData) {
        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }

        await cliente.update(clienteData);

        return this.findById(id);
    }

    async delete(id) {
        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }

        const mesasAssociadas = await Mesa.count({
            where: { cliente_id: id }
        });

        if (mesasAssociadas > 0) {
            throw new Error('Não é possível excluir cliente que possui mesas ativas.');
        }

        await cliente.destroy();
        return true;
    }
}

module.exports = new ClienteService();
