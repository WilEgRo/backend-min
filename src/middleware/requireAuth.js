// verificar header Authorization: Bearer demo-jwt
// si es correcto, llamar a next()
// si no, responder 401 Unauthorized

const DEMO_TOKEN = 'demo-jwt';

function requireAuth(req, res, next) {
    const auth = req.headers['authorization'] || '';
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] !== DEMO_TOKEN) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

module.exports = requireAuth;