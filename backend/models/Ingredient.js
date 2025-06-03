const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  cantidad: {
    type: Number,
    required: true,
    default: 0
  },
  unidad: {
    type: String,
    required: true,
    enum: ['unidades', 'litros', 'hojas', 'kilos']
  },
  stock_minimo: {
    type: Number,
    required: true,
    default: 0
  },
  disponible: {
    type: Boolean, 
    default: true,
  },
  productos_asociados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
  },
  {
    timestamps: true
  });



module.exports = mongoose.model('Ingredient', ingredientSchema);