const express = require('express');
const router = express.Router();
const Promocion = require('../models/Promocion');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Obtener todas las promociones activas
router.get('/', async (req, res) => {
  try {
    const promociones = await Promocion.find({ activa: true })
      .populate('productos')
      .sort({ fechaInicio: -1 });
    res.json(promociones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener promociones', error: error.message });
  }
});

// Obtener todas las promociones (admin)
router.get('/admin', auth, adminAuth, async (req, res) => {
  try {
    const promociones = await Promocion.find()
      .populate('productos')
      .sort({ fechaInicio: -1 });
    res.json(promociones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener promociones', error: error.message });
  }
});

// Crear nueva promoción (admin)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const promocion = new Promocion(req.body);
    await promocion.save();
    res.status(201).json(promocion);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear promoción', error: error.message });
  }
});

// Actualizar promoción (admin)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const promocion = await Promocion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!promocion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }
    res.json(promocion);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar promoción', error: error.message });
  }
});

// Eliminar promoción (admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const promocion = await Promocion.findByIdAndDelete(req.params.id);
    if (!promocion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }
    res.json({ message: 'Promoción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar promoción', error: error.message });
  }
});

module.exports = router; 