const SessionService = require('../services/SessionService');

class SessionController {
    async store(req, res) {
        try {
            const { email, password } = req.body;
            const auth = await SessionService.create(email, password);
            return res.json(auth);
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}
module.exports = new SessionController();