const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
  }
  next();
};

module.exports = adminAuth; 