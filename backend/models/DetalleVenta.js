const mongoose = require('mongoose');

const detalleVentaSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  fechaVenta: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('DetalleVenta', detalleVentaSchema);
