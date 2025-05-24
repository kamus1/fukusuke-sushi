const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/Order');
const OrdenDespacho = require('../models/OrdenDespacho');

// Carga variables desde .env
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;
const FLOW_API_URL = 'https://sandbox.flow.cl/api';
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Función para firmar los parámetros
const signParams = (params) => {
  const keys = Object.keys(params).sort();
  const str  = keys.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHmac('sha256', FLOW_SECRET_KEY).update(str).digest('hex');
};

// ===============================================
// POST /api/flow/create-order
// ===============================================
router.post('/create-order', async (req, res) => {
  const {
    email    = 'fukusukesushis@gmail.com',
    amount   = 1000,
    ticketId // ✅ este debe venir del frontend
  } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: 'Falta ticketId' });
  }

  if (!Number.isInteger(amount)) {
    return res.status(400).json({ error: 'El monto debe ser un número entero en CLP' });
  }

  const orderPayload = {
    apiKey:        FLOW_API_KEY,
    commerceOrder: ticketId,
    subject:       'Pedido en Fukusuke Sushi',
    currency:      'CLP',
    amount,
    email,
    urlConfirmation: `${WEBHOOK_URL}/api/flow/confirmation`,
    urlReturn:       `${WEBHOOK_URL}/api/flow/return`
  };

  orderPayload.s = signParams(orderPayload);

  try {
    const response = await axios.post(
      `${FLOW_API_URL}/payment/create`,
      new URLSearchParams(orderPayload),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { url, token } = response.data;

    // ✅ Guardar el token en la orden con ese ticketId
    await Order.updateOne({ ticketId }, { flowToken: token });
    console.log(`🔗 flowToken guardado para orden ${ticketId}: ${token}`);

    res.json({ url: `${url}?token=${token}`, ticketId });

  } catch (error) {
    console.error("❌ Error al crear orden con Flow:", error.response?.data || error.message);
    res.status(500).json({ error: 'Error al conectar con Flow' });
  }
});

// ===============================================
// POST /api/flow/confirmation
// (puedes dejarlo o no usarlo si no quieres webhooks)
// ===============================================
router.post('/confirmation', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    console.log('📩 Webhook recibido en /confirmation:', req.body);

    const { commerceOrder, status } = req.body;

    if (!commerceOrder) return res.status(400).send('Falta commerceOrder');
    if (parseInt(status) !== 1) return res.status(200).send('Pago no exitoso');

    const order = await Order.findOne({ ticketId: commerceOrder });
    if (!order) return res.status(404).send('Orden no encontrada');

    // Solo marcar como pagado si aún no lo está
    if (order.estado !== 'pagado') {
      order.estado = 'pagado';
      await order.save();
      console.log(`✅ Orden ${order.ticketId} marcada como pagada desde /confirmation`);
    } else {
      console.log(`ℹ️ Orden ${order.ticketId} ya estaba pagada (/confirmation)`);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Error en webhook /confirmation:', err);
    res.status(500).send('Error interno');
  }
});
// ===============================================
// POST /api/flow/return
// marca pagado sin consultar Flow
// ===============================================
router.post('/return', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const token = req.body.token || req.query.token;

    if (!token) {
      console.log('Flow /return SIN token ⇒', req.body, req.query);
      return res.status(400).send('Falta token');
    }

    // Buscar orden por flowToken
    const order = await Order.findOne({ flowToken: token });

    if (!order) {
      console.warn(`❌ No se encontró orden con token ${token}`);
      return res.redirect(302, 'http://localhost:5173/paymentsuccess?estado=no_encontrada');
    }

    if (order.estado !== 'pagado') {
      order.estado = 'pagado';
      await order.save();
      console.log(`✅ Orden ${order.flowToken} marcada como pagada desde /return`);
    }

    // ✅ Crear orden de despacho si aún no existe
    const yaExiste = await OrdenDespacho.findOne({ orderId: order._id });

    if (!yaExiste) {
      if (!order.direccionEnvio || !order.direccionEnvio.calle) {
        console.warn("⚠️ La orden no tiene una dirección válida. No se creará orden de despacho.");
      } else {
        try {
          await OrdenDespacho.create({
            direccion: order.direccionEnvio,
            orderId: order._id,
            estado: 'Pendiente'
          });
          console.log(`🚚 Orden de despacho creada para ticket ${order.ticketId}`);
        } catch (err) {
          console.error("❌ Error al crear orden de despacho:", err.message);
        }
      }
    } else {
      console.log(`ℹ️ Orden de despacho ya existía para ticket ${order.ticketId}`);
    }

    const target = `http://localhost:5173/paymentsuccess?token=${order.flowToken}`;
    return res.redirect(302, target);

  } catch (err) {
    console.error('❌ Error en /return:', err.message);
    res.status(500).send('Error procesando retorno');
  }
});
module.exports = router;
