'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leituraMesas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data_leitura: {
        type: Sequelize.DATE
      },
      contador_anterior: {
        type: Sequelize.INTEGER
      },
      contador_atual_na_visita: {
        type: Sequelize.INTEGER
      },
      fichas_rodadas_no_mes: {
        type: Sequelize.INTEGER
      },
      valor_apurado_empresa: {
        type: Sequelize.DECIMAL
      },
      valor_apurado_parceiro: {
        type: Sequelize.DECIMAL
      },
      desconto_aplicado: {
        type: Sequelize.DECIMAL
      },
      valor_pago_dinheiro: {
        type: Sequelize.DECIMAL
      },
      valor_pago_pix: {
        type: Sequelize.DECIMAL
      },
      divida_restante: {
        type: Sequelize.DECIMAL
      },
      status_pagamento: {
        type: Sequelize.STRING
      },
      mesa_id: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leituraMesas');
  }
};