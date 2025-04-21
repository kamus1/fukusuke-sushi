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