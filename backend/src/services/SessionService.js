const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { Usuario } = require('../database/index').connection.models;

class SessionService {
    async create(email, password) {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            throw new Error('Usuário ou senha inválidos.');
        }

        if (!(await usuario.checkPassword(password))) {
            throw new Error('Usuário ou senha inválidos.');
        }

        const { id, nome } = usuario;

        const token = jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
        });

        return {
            usuario: {
                id,
                nome,
                email,
            },
            token,
        };
    }
}
module.exports = new SessionService();