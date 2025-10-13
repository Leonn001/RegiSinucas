'use strict';
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.dropTable('leituras_mesas');
        await queryInterface.createTable('leituras_mesas', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            data_leitura: { type: Sequelize.DATEONLY },
            contador_anterior: { type: Sequelize.INTEGER },
            contador_atual_na_visita: { type: Sequelize.INTEGER },
            fichas_brutas: { type: Sequelize.INTEGER },
            desconto_fichas: { type: Sequelize.INTEGER },
            valor_cobrado: { type: Sequelize.DECIMAL(10, 2) },
            valor_pago: { type: Sequelize.DECIMAL(10, 2) },
            divida_restante: { type: Sequelize.DECIMAL(10, 2) },
            status_pagamento: { type: Sequelize.STRING },
            mesa_id: {
                type: Sequelize.INTEGER,
                references: { model: 'mesas', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });
    },
    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('leituras_mesas');
    }
};