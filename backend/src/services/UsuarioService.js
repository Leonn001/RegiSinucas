const { Usuario } = require('../database/index').connection.models;

class UsuarioService {
    async create(data) {
        const { email } = data;

        if (await Usuario.findOne({ where: { email } })) {
            throw new Error('Este e-mail já está em uso.');
        }

        const usuario = await Usuario.create(data);
        return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
        };
    }
}
module.exports = new UsuarioService();