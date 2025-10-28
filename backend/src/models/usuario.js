'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Usuario extends Model {
        static associate(models) {
        }

        checkPassword(password) {
            return bcrypt.compare(password, this.password_hash);
        }
    }
    Usuario.init({
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        password_hash: DataTypes.STRING,
        password: {
            type: DataTypes.VIRTUAL,
            set(value) {
                const salt = bcrypt.genSaltSync(10);
                this.setDataValue('password_hash', bcrypt.hashSync(value, salt));
            }
        }
    }, {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: false
    });

    return Usuario;
};