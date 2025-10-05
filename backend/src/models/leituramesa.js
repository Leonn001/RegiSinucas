'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeituraMesa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeituraMesa.init({
    data_leitura: DataTypes.DATE,
    contador_anterior: DataTypes.INTEGER,
    contador_atual_na_visita: DataTypes.INTEGER,
    fichas_rodadas_no_mes: DataTypes.INTEGER,
    valor_apurado_empresa: DataTypes.DECIMAL,
    valor_apurado_parceiro: DataTypes.DECIMAL,
    desconto_aplicado: DataTypes.DECIMAL,
    valor_pago_dinheiro: DataTypes.DECIMAL,
    valor_pago_pix: DataTypes.DECIMAL,
    divida_restante: DataTypes.DECIMAL,
    status_pagamento: DataTypes.STRING,
    mesa_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LeituraMesa', timestamps: false
  });
  return LeituraMesa;
};