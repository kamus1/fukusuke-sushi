const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('../frontend/src/data/products.json');
require('dotenv').config();

async function initDB() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Limpiar la colección existente
    await Product.deleteMany({});
    console.log('Colección limpiada');

    // Insertar los productos
    await Product.insertMany(products);
    console.log('Productos insertados correctamente');

    // Cerrar la conexión
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initDB(); 