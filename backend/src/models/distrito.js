'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Distrito extends Model {
        static associate(models) {
            this.belongsTo(models.Cidade, { foreignKey: 'cidade_id', as: 'cidade' });
            this.hasMany(models.Mesa, { foreignKey: 'distrito_id', as: 'mesas' });
            this.hasMany(models.Cliente, { foreignKey: 'distrito_id', as: 'clientes' });
        }
    }
    Distrito.init({
        nome: DataTypes.STRING,
        cidade_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Distrito',
        tableName: 'distritos',
        timestamps: false
    });
    return Distrito;
};