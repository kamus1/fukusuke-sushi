const mongoose = require('mongoose');

/* --- sub-documento de cada ítem --- */
const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nombre:   String,
  cantidad: { type: Number, required: true, min: 1 },
  precio:   { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

/* --- esquema principal de la orden --- */
const orderSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  email:  { type: String, required: true },
  nombres: { type: String, required: true },
  rut:    { type: String },

  items:  [orderItemSchema],
  total:  { type: Number, required: true },

  direccionEnvio: {
    calle:  String,
    numero: String,
    comuna: String,
    region: String
  },

  /* === Integración con Flow === */
  ticketId:  { type: String, unique: true },   // usado como commerceOrder
  flowToken: { type: String },                 // token que devuelve Flow
  estado:    {
    type: String,
  enum: [
    'pendiente',
    'pagado',
    'en_proceso',
    'enviado',
    'entregado',
    'cancelado',
    'rechazado',               
    'pendiente_confirmacion'
  ],
    default: 'pendiente'
  },

  fechaPedido: { type: Date, default: Date.now }
});

/* --- genera ticketId si no viene desde routes/orders.js --- */
orderSchema.pre('save', function (next) {
  if (!this.ticketId) {
    const fecha  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.ticketId = `FK-${fecha}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
