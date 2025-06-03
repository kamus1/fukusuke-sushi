const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');

async function updateProductAvailability() {
  try {
    const products = await Product.find().populate('ingredientes.ingrediente_id');
    
    for (const product of products) {
      let isAvailable = true;
      
      for (const ingrediente of product.ingredientes) {
        const ingredienteDoc = ingrediente.ingrediente_id;
        if (ingredienteDoc.cantidad < ingrediente.cantidad_utilizada) {
          isAvailable = false;
          break;
        }
      }
      
      // Convertimos a número para mantener tu esquema actual (1 = disponible, 0 = no disponible)
      const nuevaDisponibilidad = isAvailable ? 1 : 0;
      
      if (product.disponible !== nuevaDisponibilidad) {
        product.disponible = nuevaDisponibilidad;
        await product.save();
      }
    }
  } catch (error) {
    console.error('Error actualizando disponibilidad de productos:', error);
    throw error;
  }
}

module.exports = { updateProductAvailability };