const express = require('express');
const router = express.Router();
const OrdenDespacho = require('../models/OrdenDespacho');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Verificar roles
const checkRoles = (...roles) => {
  return async (req, res, next) => {
    console.log('req.user:', req.user);

    const user = await User.findById(req.user.id);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
    next();
  };
};

//Tomar una orden de despacho
router.post('/tomar/:id', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const orden = await OrdenDespacho.findById(req.params.id);
    if (!orden) return res.status(404).json({ msg: 'Orden no encontrada' });
    if (orden.encargadoDespacho) {
      return res.status(400).json({ msg: 'La orden ya está asignada' });
    }

    const despachador = await User.findById(req.user.id);
    if (!despachador) return res.status(404).json({ msg: 'Despachador no encontrado' });

    orden.encargadoDespacho = req.user.id;
    orden.emailDespachador = despachador.email;
    orden.estado = 'Asignada';
    orden.fechaSalida = new Date();
    await orden.save();

    res.json({ msg: 'Orden asignada correctamente', orden });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al asignar orden' });
  }
});

//Completar una orden de despacho
router.post('/completar/:id', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const orden = await OrdenDespacho.findById(req.params.id);
    if (!orden) return res.status(404).json({ msg: 'Orden no encontrada' });
    
    const despachador = await User.findById(req.user.id);
    if (!despachador) return res.status(404).json({ msg: 'Despachador no encontrado' });

  // Verificar que el ID del usuario coincida con el del despachador asignado
  if (!orden.encargadoDespacho || orden.encargadoDespacho.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'Solo el despachador asignado puede completar esta orden' });
  }

    orden.estado = 'Entregada';
    orden.fechaTermino = new Date();
    await orden.save();

    res.json({ msg: 'Orden completada correctamente', orden });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al completar orden' });
  }
});

//Obtener todas las órdenes de despacho
router.get('/', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const ordenes = await OrdenDespacho.find()
      .populate('encargadoDespacho', 'nombre email role')
      .populate('orderId', 'email total ticketId nombres rut telefono fechaPedido');
    res.json(ordenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener órdenes de despacho' });
  }
});

//Obtener solo las órdenes pendientes con paginación
router.get('/pendientes', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Obtener el total de órdenes para la paginación
    const total = await OrdenDespacho.countDocuments();

    // Obtener las órdenes con paginación
    const ordenes = await OrdenDespacho.find()
      .populate('orderId', 'email total ticketId nombres rut telefono fechaPedido')
      .populate('encargadoDespacho', 'nombre email')
      .sort({ 'orderId.fechaPedido': -1 }) // Ordenar por fecha más reciente
      .skip(skip)
      .limit(limit);

    res.json({
      ordenes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener órdenes pendientes' });
  }
}); 

//Obtener las órdenes asignadas al usuario actual
router.get('/mis-ordenes', auth, checkRoles('admin', 'despachador'), async (req, res) => {
  try {
    const despachador = await User.findById(req.user.id);
    if (!despachador) return res.status(404).json({ msg: 'Despachador no encontrado' });

    const misOrdenes = await OrdenDespacho.find({ emailDespachador: despachador.email })
      .populate('orderId', 'ticketId email total nombres rut telefono fechaPedido');
    res.json(misOrdenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener tus órdenes de despacho' });
  } 
});

module.exports = router;
