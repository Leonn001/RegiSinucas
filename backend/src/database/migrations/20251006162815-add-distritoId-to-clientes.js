'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('clientes', 'distrito_id', {
            type: Sequelize.INTEGER,
            references: { model: 'distritos', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', // Se um distrito for apagado, o cliente não é apagado, apenas perde a referência de morada.
            allowNull: true, // Permitimos que um cliente seja cadastrado sem um distrito associado.
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('clientes', 'distrito_id');
    }
};