const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  disponible: {
    type: Number,
    required: true
  },
  img_url: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  cantidad_piezas: {
    type: Number,
    required: true
  },
  especialidad: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  ingredientes: [{
    ingrediente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
    cantidad: Number
  }]
});

module.exports = mongoose.model('Product', productSchema); 