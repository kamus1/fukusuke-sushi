const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/Order');
const OrdenDespacho = require('../models/OrdenDespacho');
const sendComprobante = require('../utils/sendComprobante');

// Carga variables desde .env
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;
const FLOW_API_URL = 'https://sandbox.flow.cl/api';
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const IS_SANDBOX = process.env.NODE_ENV !== 'production'; // o usa otra variable como IS_SANDBOX=true en .env

// Función para firmar los parámetros
// Función para firmar los parámetros
const signParams = (params) => {
  const keys = Object.keys(params).sort(); // Ordenar los parámetros alfabéticamente
  // CORRECTO: Concatenar en el formato nombre_parametrovalor
  const str = keys.map(k => `${k}${params[k]}`).join(''); // Aquí está la corrección
  return crypto.createHmac('sha256', FLOW_SECRET_KEY).update(str).digest('hex');
};

// ===============================================
// POST /api/flow/create-order
// ===============================================
router.post('/create-order', async (req, res) => {
  const {
    email = 'fukusukesushis@gmail.com',
    amount = 1000,
    ticketId // ✅ este debe venir del frontend
  } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: 'Falta ticketId' });
  }

  if (!Number.isInteger(amount)) {
    return res.status(400).json({ error: 'El monto debe ser un número entero en CLP' });
  }

  const orderPayload = {
    apiKey: FLOW_API_KEY,
    commerceOrder: ticketId,
    subject: 'Pedido en Fukusuke Sushi',
    currency: 'CLP',
    amount,
    email,
    urlConfirmation: `${WEBHOOK_URL}/api/flow/confirmation`,
    urlReturn: `${WEBHOOK_URL}/api/flow/return`
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
// POST /api/flow/confirmation
router.post('/confirmation', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    console.log('📩 Webhook recibido en /confirmation:', req.body);
    const { token } = req.body; // Flow debería enviar 'token' aquí

    if (!token) {
      console.error('❌ Webhook /confirmation: Falta el token en el cuerpo de la solicitud.');
      return res.status(400).send('Falta token');
    }

    // 1. Preparar parámetros para payment/getStatus
    const paramsToSign = {
      apiKey: FLOW_API_KEY,
      token: token,
    };
    paramsToSign.s = signParams(paramsToSign); // Usa tu función corregida

    // 2. Llamar a Flow para obtener el estado del pago
    const flowStatusResponse = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params: paramsToSign });
    const paymentStatusData = flowStatusResponse.data;

    console.log('ℹ️ Estado del pago desde Flow (/confirmation):', paymentStatusData);

    // paymentStatusData.status: 1 (Pagada), 2 (Rechazada), 3 (Anulada), 4 (Pendiente)
    const esPagoExitoso = paymentStatusData.status === 1 || (IS_SANDBOX && paymentStatusData.status === 2);
    const order = await Order.findOne({ flowToken: token }); // O usa paymentStatusData.commerceOrder
    if (!order) {
      console.warn(`⚠️ Orden no encontrada con token ${token} o commerceOrder ${paymentStatusData.commerceOrder} desde /confirmation`);
      return res.status(404).send('Orden no encontrada');
    }
if (esPagoExitoso) {
    if (order.estado !== 'pagado') {
      order.estado = 'pagado';
      await order.save();
      console.log(`✅ Orden ${order.ticketId} (token: ${token}) marcada como pagada desde /confirmation`);
      // Aquí podrías también crear la orden de despacho si es el primer lugar donde se confirma el pago
    } else {
      console.log(`ℹ️ Orden ${order.ticketId} (token: ${token}) ya estaba pagada (/confirmation)`);
    }
    res.status(200).send('OK_PAGO_CONFIRMADO'); // Flow espera un 200 OK
  } else {
    console.log(`⚠️ Pago no exitoso para token ${token} desde /confirmation. Estado Flow: ${paymentStatusData.status}`);
    // Considera qué responder a Flow si el pago no fue exitoso pero el webhook se recibió.
    // Un 200 OK igual puede ser apropiado para indicar que recibiste la notificación.
    res.status(200).send('OK_PAGO_NO_EXITOSO');
  }
} catch (err) {
  console.error('❌ Error en webhook /confirmation:', err.response?.data || err.message || err);
  // No envíes un 500 a Flow directamente si es posible, podría causar reintentos innecesarios.
  // Si es un error de tu lado, intenta manejarlo y responder a Flow que recibiste el webhook.
  res.status(200).send('ERROR_INTERNO_AL_PROCESAR_CONFIRMACION'); // O un 500 si el error es irrecuperable y quieres que Flow reintente
}
});

// ===============================================
// POST /api/flow/return
// marca pagado sin consultar Flow
// ===============================================
router.post('/return', express.urlencoded({ extended: true }), async (req, res) => {
  let token;
  try {
    token = req.body.token || req.query.token;

    if (!token) {
      console.log('Flow /return SIN token ⇒', req.body, req.query);
      return res.redirect(302, 'http://localhost:5173/paymenterror?error=token_faltante');
    }

    // 1. Preparar parámetros para payment/getStatus
    const paramsToSign = {
      apiKey: FLOW_API_KEY,
      token: token,
    };
    paramsToSign.s = signParams(paramsToSign); // Usa tu función corregida

    // 2. Llamar a Flow para obtener el estado del pago
    const flowStatusResponse = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params: paramsToSign });
    const paymentStatusData = flowStatusResponse.data;

    console.log('ℹ️ Estado del pago desde Flow (/return):', paymentStatusData);

    // 🔧 Determinar si es un pago exitoso, incluso en sandbox
    const esPagoExitoso = paymentStatusData.status === 1 || (IS_SANDBOX && paymentStatusData.status === 2);

    const order = await Order.findOne({ flowToken: token }); // O buscar por paymentStatusData.commerceOrder

    if (!order) {
      console.warn(`❌ No se encontró orden con token ${token} o commerceOrder ${paymentStatusData.commerceOrder} en /return`);
      return res.redirect(302, `http://localhost:5173/paymenterror?estado=no_encontrada&token=${token}`);
    }

    if (esPagoExitoso) {
      if (order.estado !== 'pagado') {
        order.estado = 'pagado';
        await order.save();
        console.log(`✅ Orden ${order.ticketId} (token: ${token}) marcada como pagada desde /return`);
      }

      // Crear orden de despacho
      const yaExiste = await OrdenDespacho.findOne({ orderId: order._id });
      if (!yaExiste) {
        if (order.direccionEnvio && order.direccionEnvio.calle) {
          await OrdenDespacho.create({
            direccion: order.direccionEnvio,
            orderId: order._id,
            estado: 'Pendiente'
          });
          console.log(`🚚 Orden de despacho creada para ticket ${order.ticketId} desde /return`);
        } else {
          console.warn("⚠️ La orden no tiene una dirección válida. No se creará orden de despacho desde /return.");
        }
      } else {
        console.log(`ℹ️ Orden de despacho ya existía para ticket ${order.ticketId} (/return)`);
      }

      // Enviar comprobante
      try {
        await sendComprobante(order);
        console.log(`✅ Comprobante enviado exitosamente a ${order.email} desde /return`);
      } catch (error) {
        console.error(`❌ Error al enviar comprobante desde /return:`, error.message);
      }

      return res.redirect(302, `http://localhost:5173/paymentsuccess?token=${token}`);
    } else if (paymentStatusData.status === 2) { // Rechazada
      console.log(`🚫 Pago rechazado para orden con token ${token} desde /return. Estado Flow: ${paymentStatusData.status}`);
      order.estado = 'rechazado'; // Asegúrate de que 'rechazado' está en el enum de tu modelo
      await order.save();
      return res.redirect(302, `http://localhost:5173/paymenterror?estado=rechazado&token=${token}`);
    } else {
      console.log(`⏳ Estado de pago no confirmado/pendiente para orden con token ${token} desde /return. Estado Flow: ${paymentStatusData.status}`);
      order.estado = 'pendiente_confirmacion';
      await order.save();
      return res.redirect(302, `http://localhost:5173/paymentpending?estado=pendiente&token=${token}`);
    }

  } catch (err) {
    console.error('❌ Error en /return:', err.response?.data || err.message || err);
    const errorQueryParam = err.response?.data?.message || 'error_procesando_retorno';
    const targetUrl = token
      ? `http://localhost:5173/paymenterror?error=${encodeURIComponent(errorQueryParam)}&token=${token}`
      : `http://localhost:5173/paymenterror?error=${encodeURIComponent(errorQueryParam)}`;
    return res.redirect(302, targetUrl);
  }
});



router.get('/generar-firma', (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: 'Falta el parámetro token' });
  }

  const params = {
    apiKey: FLOW_API_KEY,
    token: token
  };

  const s = signParams(params);
  console.log('🖋️ Firma generada para getStatus:', s);

  return res.json({
    ...params,
    s
  });
});
module.exports = router;
 