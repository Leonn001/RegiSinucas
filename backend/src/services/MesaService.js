const { Mesa, Cliente, Distrito, Cidade, LeituraMesa } = require('../database/index').connection.models;
const database = require('../database/index');
const sequelize = database.connection;

class MesaService {
    async create(mesaData) {
        const { numero_serie } = mesaData;

        const mesaExists = await Mesa.findOne({ where: { numero_serie } });
        if (mesaExists) throw new Error('Número de série já cadastrado.');

        const mesa = await Mesa.create(mesaData);
        return mesa;
    }

    async findAll() {
        const mesas = await Mesa.findAll({
            include: [
                { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
                {
                    model: Distrito,
                    as: 'distrito',
                    attributes: ['id', 'nome'],
                    include: [
                        { model: Cidade, as: 'cidade', attributes: ['id', 'nome', 'estado'] }
                    ]
                }
            ]
        });

        return mesas;
    }

    async findById(id) {
        return await Mesa.findByPk(id, {
            include: [
                { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
                {
                    model: Distrito,
                    as: 'distrito',
                    attributes: ['id', 'nome'],
                    include: [
                        { model: Cidade, as: 'cidade', attributes: ['id', 'nome', 'estado'] }
                    ]
                }
            ]
        });
    }

    async update(id, mesaData) {
        const mesa = await Mesa.findByPk(id);
        if (!mesa) {
            throw new Error('Mesa não encontrada.');
        }

        delete mesaData.contador_ultima_leitura;
        delete mesaData.status;

        await mesa.update(mesaData);
        return this.findById(id);
    }

    async delete(id) {
        const mesa = await Mesa.findByPk(id);
        if (!mesa) {
            throw new Error('Mesa não encontrada.');
        }
        await mesa.destroy();
        return true;
    }

    async inativar(id) {

        const distritoGalpao = await Distrito.findOne({ where: { nome: 'Galpão' } });

        if (!distritoGalpao) {
            throw new Error('Distrito "Galpão" não encontrado. Crie este distrito primeiro.');
        }

        const mesa = await Mesa.findByPk(id);
        if (!mesa) {
            throw new Error('Mesa não encontrada.');
        }
        if (mesa.status === 'Inativa') {
            throw new Error('Esta mesa já está inativa.');
        }

        const t = await sequelize.transaction();

        try {
            await LeituraMesa.destroy({
                where: { mesa_id: id },
                transaction: t
            });

            await mesa.update({
                status: 'Inativa',
                cliente_id: null,
                distrito_id: distritoGalpao.id,
                nome_ponto_comercial: 'Galpão',
                endereco_completo: 'Galpão'
            }, { transaction: t });

            await t.commit();
            return true;

        } catch (error) {
            await t.rollback();
            throw new Error('Falha na transação: ' + error.message);
        }
    }
}

module.exports = new MesaService();
