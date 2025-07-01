// routes/ingredients.js
const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');
const Product = require('../models/Product');
const { updateProductAvailability } = require('../utils/productAvailability');

// Crear un nuevo ingrediente
router.post('/', async (req, res) => {
  try {
    // Validación básica
    const { nombre, cantidad, unidad, stock_minimo, img_url } = req.body;
    
    if (!nombre || !unidad) {
      return res.status(400).json({ message: 'Nombre y unidad son requeridos' });
    }

    // Crear el nuevo ingrediente
    const nuevoIngrediente = new Ingredient({
      nombre,
      cantidad: Number(cantidad) || 0,
      unidad,
      stock_minimo: Number(stock_minimo) || 0,
      disponible: true, // Por defecto disponible al crear
      img_url: img_url || undefined // Incluir img_url si se proporciona
    });

    // Guardar en la base de datos
    const ingredienteGuardado = await nuevoIngrediente.save();

    // Responder con el ingrediente creado
    res.status(201).json(ingredienteGuardado);

  } catch (error) {
    console.error('Error en createIngredient:', error);
    
    // Manejar errores de duplicados (nombre único)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Este ingrediente ya existe' });
    }

    res.status(500).json({ 
      message: 'Error al crear ingrediente',
      error: error.message 
    });
  }
});

// Obtener todos los ingredientes
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ingredientes' });
  }
});

// Actualizar un ingrediente
router.put('/:id',  async (req, res) => {
  try {
    const { nombre, cantidad, unidad, stock_minimo, disponible, img_url } = req.body;
    
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { 
        nombre,
        cantidad,
        unidad,
        stock_minimo,
        disponible,
        img_url: img_url || undefined // Incluir img_url si se proporciona
      },
      { new: true, runValidators: true  } // runValidators asegura que se apliquen las validaciones del esquema
    );
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
    
    await updateProductAvailability();
    
    res.json(ingredient);
  } catch (error) {
    console.error('Error al actualizar ingrediente:', error);
    res.status(500).json({ 
      message: 'Error al actualizar ingrediente',
      error: error.message 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
    
    // Actualizar disponibilidad de productos
    await updateProductAvailability();
    
    res.json({ message: 'Ingrediente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar ingrediente' });
  }
});



// Obtener productos afectados por un ingrediente
router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ 
      'ingredientes.ingrediente_id': req.params.id 
    }).select('id nombre disponible');
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos afectados' });
  }
});

module.exports = router;