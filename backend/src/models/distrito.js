'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Distrito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Distrito.init({
    nome: DataTypes.STRING,
    cidade_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Distrito', timestamps: false
  });
  return Distrito;
};