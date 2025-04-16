// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); // Importa el modelo Admin
const router = express.Router();

// Ruta de login para admins
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar al administrador por el nombre de usuario
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar si la contraseña es correcta
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Crear un token JWT
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      'secreto-para-firmar-el-token', // Cambia esta clave secreta
      { expiresIn: '1h' }
    );

    // Devolver el token al frontend
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
