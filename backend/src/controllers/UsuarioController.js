const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    async store(req, res) {
        try {
            const usuario = await UsuarioService.create(req.body);
            return res.status(201).json(usuario);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
module.exports = new UsuarioController();