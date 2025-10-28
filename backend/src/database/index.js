const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Usuario = require('../models/Usuario');
const Cliente = require('../models/cliente');
const Mesa = require('../models/mesa');
const LeituraMesa = require('../models/leituramesa');
const Cidade = require('../models/cidade');
const Distrito = require('../models/distrito');

const models = [Cliente, Mesa, LeituraMesa, Cidade, Distrito,Usuario];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(dbConfig);

        models.forEach(modelFactory => modelFactory(this.connection, Sequelize.DataTypes));

        Object.values(this.connection.models)
            .filter(model => typeof model.associate === 'function')
            .forEach(model => model.associate(this.connection.models));

    }
}

module.exports = new Database();