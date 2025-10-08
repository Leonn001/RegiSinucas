'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LeituraMesa extends Model {
        static associate(models) {
            this.belongsTo(models.Mesa, { foreignKey: 'mesa_id', as: 'mesa' });
        }
    }
    LeituraMesa.init({
        data_leitura: DataTypes.DATE,
        contador_anterior: DataTypes.INTEGER,
        contador_atual_na_visita: DataTypes.INTEGER,
        fichas_brutas: DataTypes.INTEGER,
        desconto_fichas: DataTypes.INTEGER,
        fichas_liquidas: DataTypes.INTEGER,
        valor_total_apurado: DataTypes.DECIMAL,
        valor_cobrado_empresa: DataTypes.DECIMAL,
        valor_pago_dinheiro: DataTypes.DECIMAL,
        valor_pago_pix: DataTypes.DECIMAL,
        divida_restante: DataTypes.DECIMAL,
        status_pagamento: DataTypes.STRING,
        mesa_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'LeituraMesa',
        tableName: 'leituras_mesas',
        timestamps: false
    });
    return LeituraMesa;
};