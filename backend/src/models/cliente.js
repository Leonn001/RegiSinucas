'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cliente extends Model {
        static associate(models) {
            this.hasMany(models.Mesa, { foreignKey: 'cliente_id', as: 'mesas' });
            this.belongsTo(models.Distrito, { foreignKey: 'distrito_id', as: 'distrito' });
        }
    }
    Cliente.init({
        nome: DataTypes.STRING,
        telefone: DataTypes.STRING,
        distrito_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Cliente',
        tableName: 'clientes',
        timestamps: false
    });
    return Cliente;
};