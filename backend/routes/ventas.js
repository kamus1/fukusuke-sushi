const express = require('express');
const router = express.Router();
const DetalleVenta = require('../models/DetalleVenta');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

//midleware auth: verifica el token JWT

// Obtener todas las ventas (solo admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const ventas = await DetalleVenta.find()
      .sort({ fechaVenta: -1 }); // Ordenar por fecha descendente
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
  }
});

module.exports = router; 