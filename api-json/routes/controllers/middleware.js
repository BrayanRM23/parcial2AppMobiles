const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtener el token de la cabecera

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ mensaje: 'Token inválido.' });
        }
        req.user = user; // Guardar los datos del usuario en el objeto req
        next(); // Pasar al siguiente middleware o función
    });
};

module.exports = authMiddleware;


