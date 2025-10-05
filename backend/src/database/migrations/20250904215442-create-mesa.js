'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mesas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero_serie: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      nome_ponto_comercial: {
        type: Sequelize.STRING
      },
      endereco_completo: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.DECIMAL
      },
      longitude: {
        type: Sequelize.DECIMAL
      },
      valor_ficha_padrao: {
        type: Sequelize.DECIMAL
      },
      contador_ultima_leitura: {
        type: Sequelize.INTEGER
      },
      contador_leitura_atual: {
        type: Sequelize.INTEGER
      },
      precisa_manutencao: {
        type: Sequelize.BOOLEAN
      },
      descricao_manutencao: {
        type: Sequelize.TEXT
      },
      url_foto_atual: {
        type: Sequelize.STRING
      },
      cliente_id: {
        type: Sequelize.INTEGER
      },
      distrito_id: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mesas');
  }
};