const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('./admin.model');

const SECRET = 'tu_secreto_super_seguro'; // Mejor usar variable de entorno

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
