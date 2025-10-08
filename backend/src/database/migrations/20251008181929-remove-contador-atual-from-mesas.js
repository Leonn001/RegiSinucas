'use strict';
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.removeColumn('mesas', 'contador_leitura_atual');
    },
    async down (queryInterface, Sequelize) {
        await queryInterface.addColumn('mesas', 'contador_leitura_atual', { type: Sequelize.INTEGER });
    }
};