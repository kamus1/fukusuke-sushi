const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

// Carga variables desde .env
const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;
const FLOW_API_URL = 'https://sandbox.flow.cl/api'; // Producción: https://www.flow.cl/api
const WEBHOOK_URL = process.env.WEBHOOK_URL;


// Función para firmar los parámetros
const signParams = (params) => {
  const keys = Object.keys(params).sort();
  const signStr = keys.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHmac('sha256', FLOW_SECRET_KEY).update(signStr).digest('hex');
};

// Endpoint para crear orden de pago
router.post('/create-order', async (req, res) => {
  const { email = 'fukusukesushis@gmail.com', amount = 1000 } = req.body;

  // Asegurarse de que amount sea un número entero válido
  if (!Number.isInteger(amount)) {
    return res.status(400).json({ error: 'El monto debe ser un número entero en CLP' });
  }

  const order = {
    apiKey: FLOW_API_KEY,
    commerceOrder: Date.now().toString(), // ID único por orden
    subject: 'Pedido en Fukusuke Sushi',
    currency: 'CLP',
    amount,
    email,
    urlConfirmation: WEBHOOK_URL, // reemplaza por URL válida en desarrollo
    //urlReturn:'https://es.wikipedia.org/wiki/Wikipedia:Portada'
    urlReturn: 'http://localhost:5173/fukusuke-sushi/paymentsuccess'
    //urlReturn: 'https://4379-186-79-198-40.ngrok-free.app/fukusuke-sushi/paymentsuccess'
  };

  // Agrega la firma
  order.s = signParams(order);

  try {
    // Enviar la orden a Flow
    const response = await axios.post(
      `${FLOW_API_URL}/payment/create`,
      new URLSearchParams(order), // importante: enviar como formulario
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // Redirigir al usuario a Flow
    const { url, token } = response.data;
    res.json({ url: `${url}?token=${token}` });

  } catch (error) {
    // Captura errores detalladamente
    console.error("Error al crear orden con Flow:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      res.status(500).json({ error: error.response.data.message || 'Error en API de Flow' });
    } else {
      console.error("Message:", error.message);
      res.status(500).json({ error: 'Error al conectar con Flow' });
    }
  }
});

module.exports = router;
