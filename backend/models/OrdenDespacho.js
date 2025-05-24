const mongoose = require('mongoose');

const EstadoOrden = ['Pendiente', 'Asignada', 'Entregada'];

const ordenDespachoSchema = new mongoose.Schema({
  direccion: {
    calle: String,
    numero: String,
    comuna: String,
    region: String
  },

  encargadoDespacho: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reutilizamos el modelo User
    default: null
  },

  fechaSalida: {
    type: Date,
    default: null
  },

  fechaTermino: {
    type: Date,
    default: null
  },

  estado: {
    type: String,
    enum: EstadoOrden,
    default: 'Pendiente'
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
});

module.exports = mongoose.model('OrdenDespacho', ordenDespachoSchema);
