const mongoose = require('mongoose');

const EstadoOrden = ['Pendiente', 'Asignada', 'Entregada'];

const ordenDespachoSchema = new mongoose.Schema({
  direccion: {
    calle: String,
    numeroCasa: String,
    comuna: String,
    region: String
  },

  telefono: {
    type: String,
    required: true
  },

  encargadoDespacho: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reutilizando el modelo User
    default: null
  },

  emailDespachador: {
    type: String,
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

  //id de la orden, o del comprobante de pago asociado
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
});

module.exports = mongoose.model('OrdenDespacho', ordenDespachoSchema);
