const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nombre: String,
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precio: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  email: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  direccionEnvio: {
    calle: String,
    numero: String,
    comuna: String,
    region: String
  },
  ticketId: {
    type: String,
    unique: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'en_proceso', 'enviado', 'entregado', 'cancelado'],
    default: 'pagado'
  },
  fechaPedido: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const fecha = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.ticketId = `FK-${fecha}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema); 