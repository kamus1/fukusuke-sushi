// utils/sendComprobante.js
const mailjet = require('node-mailjet')
  .apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

const sendComprobante = async (order) => {
  // Validar variables de entorno
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
    throw new Error('Las credenciales de Mailjet no están configuradas en las variables de entorno');
  }

  // Validar datos de la orden
  if (!order || !order.email || !order.items || !order.total) {
    throw new Error('Datos de la orden incompletos para enviar el comprobante');
  }

  const productosHTML = order.items.map(item =>
    `<li>${item.nombre} - ${item.cantidad} x $${item.precio.toLocaleString()} = <strong>$${item.subtotal.toLocaleString()}</strong></li>`
  ).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Comprobante de Pago - Fukusuke Sushi</h2>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Ticket:</strong> ${order.ticketId}</p>
        <p><strong>Fecha:</strong> ${new Date(order.fechaPedido).toLocaleString()}</p>
        <p><strong>Nombre:</strong> ${order.nombres || 'Cliente'}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Teléfono:</strong> ${order.telefono}</p>
      </div>
      <h3 style="color: #444;">Productos:</h3>
      <ul style="list-style: none; padding: 0;">${productosHTML}</ul>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
        <p style="font-size: 18px; font-weight: bold;">Total pagado: $${order.total.toLocaleString()}</p>
      </div>
    </div>
  `;

  try {
    const response = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [{
          From: {
            Email: "fukusukesushis@gmail.com", 
            Name: "Fukusuke Sushi"
          },
          To: [{
            Email: order.email,
            Name: order.nombres || 'Cliente'
          }],
          Subject: `Comprobante de compra - Ticket #${order.ticketId}`,
          HTMLPart: htmlContent
        }]
      });

    console.log('✅ Email enviado exitosamente:', response.body);
    return response;
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    if (error.response) {
      console.error('Detalles del error:', error.response.body);
    }
    throw error;
  }
};

module.exports = sendComprobante;
