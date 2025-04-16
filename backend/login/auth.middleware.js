// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No hay token, acceso denegado' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto-para-firmar-el-token'); // Usa la misma clave secreta
    req.admin = decoded; // Añadir el admin al objeto request
    next(); // Continuar al siguiente middleware o ruta
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = protect;
