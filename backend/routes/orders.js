const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Crear pedido
router.post('/', auth, async (req, res) => {
  try {
    const { items, direccionEnvio, total, email } = req.body;
    
    const order = new Order({
      user: req.user.id,
      email,
      items,
      direccionEnvio,
      total,
      estado: 'pagado'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Error al crear el pedido' });
  }
});

router.get('/ticket/:ticketId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ ticketId: req.params.ticketId });
    if (!order) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el pedido' });
  }
});

module.exports = router; 


// para crear pedidos como invitado (sin autenticación)
router.post('/public', async (req, res) => {
  try {
    const { items, direccionEnvio, total, email } = req.body;

    // Validaciones mínimas
    if (!email || !items || items.length === 0 || !total || !direccionEnvio) {
      return res.status(400).json({ msg: 'Faltan datos del pedido' });
    }

    const order = new Order({
      user: null, // no está asociado a un usuario
      email,
      items,
      direccionEnvio,
      total,
      estado: 'pendiente' // o 'pagado' si prefieres
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error al crear pedido público:', error);
    res.status(500).json({ msg: 'Error al crear el pedido como invitado' });
  }
});
