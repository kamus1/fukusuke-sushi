const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const auth    = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const DetalleVenta = require('../models/DetalleVenta');

/* helper: genera ticketId */
const generateTicketId = () => {
  const fecha  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `FK-${fecha}-${random}`;
};

/* ---------- Crear pedido autenticado ---------- */
router.post('/', auth, async (req, res) => {
  try {
    const { items, direccionEnvio, total, email, nombres, rut, telefono } = req.body;
    const ticketId = generateTicketId();

    const order = new Order({
      user: req.user.id,
      email,
      nombres,
      rut,
      telefono,
      items,
      direccionEnvio,
      total,
      ticketId,
      estado: 'pendiente'
    });

    await order.save();

    //crear los detalles de venta
    const fechaVenta = new Date();
    const detalles = items.map(item => ({
      orderId: order._id,
      productId: item.product,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.subtotal,
      fechaVenta
    }));

    await DetalleVenta.insertMany(detalles);

    res.status(201).json({ order, ticketId });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear el pedido' });
  }
});

/* ---------- Crear pedido público ---------- */
router.post('/public', async (req, res) => {
  try {
    const { items, direccionEnvio, total, email, nombres, rut, telefono } = req.body;
    if (!email || !items?.length || !total || !direccionEnvio || !nombres || !telefono) {
      return res.status(400).json({ msg: 'Faltan datos del pedido' });
    }

    const ticketId = generateTicketId(); 

    const order = new Order({
      user: null,
      email,
      nombres,
      rut,
      telefono,
      items,
      direccionEnvio,
      total,
      ticketId,
      estado: 'pendiente'
    });

    await order.save();

    //crear los detalles de venta
    const fechaVenta = new Date();
    const detalles = items.map(item => ({
      orderId: order._id,
      productId: item.product,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.subtotal,
      fechaVenta
    }));

    await DetalleVenta.insertMany(detalles);
    res.status(201).json({ order, ticketId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear el pedido' });
  }
});

/* ---------- Obtener pedido por flowToken ---------- */
router.get('/by-token/:token', async (req, res) => {
  try {
    const order = await Order.findOne({ flowToken: req.params.token });
    if (!order) return res.status(404).json({ msg: 'Comprobante no encontrado' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al buscar el comprobante' });
  }
});

/* ---------- Obtener todas las órdenes (solo admin) ---------- */
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ fechaPedido: -1 }); // Ordenar por fecha descendente
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener las órdenes' });
  }
});

module.exports = router;
