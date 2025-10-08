'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mesa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mesa.init({
    numero_serie: DataTypes.STRING,
    status: DataTypes.STRING,
    nome_ponto_comercial: DataTypes.STRING,
    endereco_completo: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    valor_ficha_padrao: DataTypes.DECIMAL,
    contador_ultima_leitura: DataTypes.INTEGER,
    precisa_manutencao: DataTypes.BOOLEAN,
    descricao_manutencao: DataTypes.TEXT,
    url_foto_atual: DataTypes.STRING,
    cliente_id: DataTypes.INTEGER,
    distrito_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Mesa', timestamps: false
  });
  return Mesa;
};