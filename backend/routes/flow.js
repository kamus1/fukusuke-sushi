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
const FRONTEND_URL = process.env.FRONTEND_URL

// Función para firmar los parámetros
const signParams = (params) => {
  const keys = Object.keys(params).sort(); // Ordenar los parámetros alfabéticamente
  //Concatenar en el formato nombre_parametrovalor
  const str = keys.map(k => `${k}${params[k]}`).join('');
  return crypto.createHmac('sha256', FLOW_SECRET_KEY).update(str).digest('hex');
};

// ===============================================
// POST /api/flow/create-order
// ===============================================
router.post('/create-order', async (req, res) => {
  const { email, amount, ticketId } = req.body;

  //detección de errores
  if (!ticketId) { return res.status(400).json({ error: 'Falta ticketId' }); }
  if (!email) { return res.status(400).json({ error: 'Falta un email' }); }
  if (!Number.isInteger(amount)) { return res.status(400).json({ error: 'El monto debe ser un número entero en CLP' }); }


  //variable de orden de pago para flow
  const orderPayload = {
    apiKey: FLOW_API_KEY,
    commerceOrder: ticketId, // ticket es generado por backend
    subject: 'Pedido en Fukusuke Sushi',
    currency: 'CLP',
    amount,
    email,
    urlConfirmation: `${WEBHOOK_URL}/api/flow/confirmation`,
    urlReturn: `${WEBHOOK_URL}/api/flow/return`
  };

  orderPayload.s = signParams(orderPayload); // firmar los parametros

  //hacer llamada principal de compra a flow
  try {
    const response = await axios.post(
      `${FLOW_API_URL}/payment/create`,
      new URLSearchParams(orderPayload),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { url, token } = response.data;

    //guardar el token en la orden (comprobante de pago) con ese ticketId
    await Order.updateOne({ ticketId }, { flowToken: token });
    console.log(`flowToken guardado para orden ${ticketId}: ${token}`);

    res.json({ url: `${url}?token=${token}`, ticketId });

  } catch (error) {
    console.error("Error al crear orden con Flow:", error.response?.data || error.message);
    res.status(500).json({ error: 'Error al conectar con Flow' });
  }
});

// ===============================================
// POST /api/flow/confirmation, el endpoint al que hace llamado flow
// ===============================================
router.post('/confirmation', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    console.log('Webhook recibido en /confirmation:', req.body);
    const { token } = req.body; // Flow envía el token

    if (!token) {
      console.error('Webhook /confirmation: Falta el token en el cuerpo de la solicitud.');
      return res.status(400).send('Falta token');
    }

    //Preparar parámetros para payment/getStatus
    const paramsToSign = {
      apiKey: FLOW_API_KEY,
      token: token,
    };
    paramsToSign.s = signParams(paramsToSign); //firma de los parametros 

    //Llamar a Flow para obtener el estado del pago
    const flowStatusResponse = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params: paramsToSign });
    const paymentStatusData = flowStatusResponse.data;

    console.log('Estado del pago desde Flow (/confirmation):', paymentStatusData);
    // paymentStatusData.status:
    // https://www.flow.cl/docs/api.html#tag/payment/paths/~1payment~1getStatus/get:~:text=El%20estado%20de%20la%20order
    // 1 pendiente de pago
    // 2 pagada
    // 3 rechazada
    // 4 anulada
    const esPagoExitoso = paymentStatusData.status === 2;
    const order = await Order.findOne({ flowToken: token }); // busca la orden que tenga el token asociado a la compra
    if (!order) {
      console.warn(`Orden no encontrada con token ${token} o commerceOrder ${paymentStatusData.commerceOrder} desde /confirmation`);
      return res.status(404).send('Orden no encontrada');
    }


    if (esPagoExitoso) {
      if (order.estado !== 'pagado') {
        order.estado = 'pagado';
        await order.save();
        console.log(`Orden ${order.ticketId} (token: ${token}) marcada como pagada desde /confirmation`);

        // Crear orden de despacho
        const yaExiste = await OrdenDespacho.findOne({ orderId: order._id });
        if (!yaExiste) {
          if (order.direccionEnvio && order.direccionEnvio.calle) {
            await OrdenDespacho.create({
              direccion: order.direccionEnvio,
              telefono: order.telefono,
              orderId: order._id, //orden de despacho relacionada con su order (comprobante)
              estado: 'Pendiente'
            });
            console.log(`Orden de despacho creada para ticket ${order.ticketId} desde /return`);
          } else {
            console.warn("La orden no tiene una dirección válida. No se creará orden de despacho desde /return.");
          }
        } else {
          console.log(`Orden de despacho ya existía para ticket ${order.ticketId} (/return)`);
        }

        // Enviar comprobante por MAILJET
        try {
          await sendComprobante(order);
          console.log(`Comprobante enviado exitosamente a ${order.email} desde /return`);
        } catch (error) {
          console.error(`Error al enviar comprobante desde /return:`, error.message);
        }


      } else {
        console.log(`Orden ${order.ticketId} (token: ${token}) ya estaba pagada (/confirmation)`);
      }
      res.status(200).send('OK_PAGO_CONFIRMADO');
    } else {
      console.log(`Pago no exitoso para token ${token} desde /confirmation. Estado Flow: ${paymentStatusData.status}`);
      res.status(200).send('OK_PAGO_NO_EXITOSO');
    }
  } catch (err) {
    console.error('Error en webhook /confirmation:', err.response?.data || err.message || err);
    res.status(200).send('ERROR_INTERNO_AL_PROCESAR_CONFIRMACION'); //500 si el error es irrecuperable así Flow reintente
  }
});

// ===============================================
// POST /api/flow/return
// es lo que retorna flow luego del pago
// ===============================================
router.post('/return', express.urlencoded({ extended: true }), async (req, res) => {
  let token;
  try {
    token = req.body.token || req.query.token;

    if (!token) {
      console.log('Flow /return SIN token ⇒', req.body, req.query);
      return res.redirect(302, `${FRONTEND_URL}/paymenterror?error=token_faltante`);
    }

    //preparar parámetros para payment/getStatus
    const paramsToSign = { apiKey: FLOW_API_KEY, token: token, };
    paramsToSign.s = signParams(paramsToSign);

    //llamar a Flow para obtener el estado del pago
    const flowStatusResponse = await axios.get(`${FLOW_API_URL}/payment/getStatus`, { params: paramsToSign });
    const paymentStatusData = flowStatusResponse.data;

    console.log('Estado del pago desde Flow (/return):', paymentStatusData);

    //Determinar si es un pago exitoso 
    const esPagoExitoso = paymentStatusData.status === 2;

    const order = await Order.findOne({ flowToken: token });

    if (!order) {
      console.warn(`No se encontró orden con token ${token} o commerceOrder ${paymentStatusData.commerceOrder} en /return`);
      return res.redirect(302, `${FRONTEND_URL}/paymenterror?estado=no_encontrada&token=${token}`);
    }

    if (esPagoExitoso) {
      if (order.estado !== 'pagado') {
        //esto es una doble verificación
        order.estado = 'pagado';
        await order.save();
        console.log(`Orden ${order.ticketId} (token: ${token}) marcada como pagada desde /return`);
      }

      //redirect al succes de localhost website
      return res.redirect(302, `${FRONTEND_URL}/paymentsuccess?token=${token}`);

    } else if (paymentStatusData.status === 3) { //3 es rechazado
      console.log(`Pago rechazado para orden con token ${token} desde /return. Estado Flow: ${paymentStatusData.status}`);
      order.estado = 'rechazado';
      await order.save();
      //redirect
      return res.redirect(302, `${FRONTEND_URL}/paymenterror?estado=rechazado&token=${token}`);
    } else {
      console.log(`Estado de pago no confirmado/pendiente para orden con token ${token} desde /return. Estado Flow: ${paymentStatusData.status}`);
      order.estado = 'pendiente_confirmacion';
      await order.save();
      //redirect
      return res.redirect(302, `${FRONTEND_URL}/paymentpending?estado=pendiente&token=${token}`);
    }

  } catch (err) {
    console.error('Error en /return:', err.response?.data || err.message || err);
    const errorQueryParam = err.response?.data?.message || 'error_procesando_retorno';
    const targetUrl = token
      ? `${FRONTEND_URL}/paymenterror?error=${encodeURIComponent(errorQueryParam)}&token=${token}`
      : `${FRONTEND_URL}/paymenterror?error=${encodeURIComponent(errorQueryParam)}`;
    return res.redirect(302, targetUrl);
  }
});



router.get('/generar-firma', (req, res) => {
  //para testing obtener firma necesaria para hacer un get a flow
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: 'Falta el parámetro token' });
  }

  const params = {
    apiKey: FLOW_API_KEY,
    token: token
  };

  const s = signParams(params);
  console.log('Firma generada para getStatus:', s);

  return res.json({
    ...params,
    s
  });
});
module.exports = router;
