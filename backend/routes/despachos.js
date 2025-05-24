const express = require('express');
const router = express.Router();
const OrdenDespacho = require('../models/OrdenDespacho');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Verificar roles
const checkRoles = (...roles) => {
  return async (req, res, next) => {
    console.log('🔍 req.user:', req.user); // ✅ esto debería mostrar { id, role }

    const user = await User.findById(req.user.id);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
    next();
  };
};

// ✅ Tomar una orden de despacho
router.post('/tomar/:id', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const orden = await OrdenDespacho.findById(req.params.id);
    if (!orden) return res.status(404).json({ msg: 'Orden no encontrada' });
    if (orden.encargadoDespacho) {
      return res.status(400).json({ msg: 'La orden ya está asignada' });
    }

    orden.encargadoDespacho = req.user.id;
    orden.estado = 'Asignada';
    orden.fechaSalida = new Date();
    await orden.save();

    res.json({ msg: 'Orden asignada correctamente', orden });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al asignar orden' });
  }
});

// ✅ Obtener todas las órdenes de despacho
router.get('/', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const ordenes = await OrdenDespacho.find()
      .populate('encargadoDespacho', 'nombre email role')
      .populate('orderId', 'email total ticketId');
    res.json(ordenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener órdenes de despacho' });
  }
});

// ✅ Obtener solo las órdenes pendientes
router.get('/pendientes', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const pendientes = await OrdenDespacho.find({ estado: 'Pendiente' })
      .populate('orderId', 'email total ticketId');
    res.json(pendientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener órdenes pendientes' });
  }
});

// ✅ Obtener las órdenes asignadas al usuario actual
router.get('/mis-ordenes', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const misOrdenes = await OrdenDespacho.find({ encargadoDespacho: req.user.id })
      .populate('orderId', 'ticketId email total');
    res.json(misOrdenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener tus órdenes de despacho' });
  }
});

module.exports = router;
