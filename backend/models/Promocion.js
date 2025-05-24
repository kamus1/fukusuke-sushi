const mongoose = require('mongoose');

const promocionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    required: false
  },
  descripcion: {
    type: String,
    required: true
  },
  descuento: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  activa: {
    type: Boolean,
    default: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  productos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Promocion', promocionSchema); 