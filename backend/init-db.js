const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');
const products = require('../frontend/src/data/products.json');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Crear usuario admin por defecto
      const adminUser = new User({
        email: 'admin@fukusuke.com',
        password: 'admin123', // Se encriptará automáticamente por el middleware del modelo
        role: 'admin',
        nombre: 'Administrador'
      });

      await adminUser.save();
      console.log('Usuario administrador creado exitosamente');
    }
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  }
};

const initDatabase = async () => {
  try {
    // Conexión a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Crear usuario admin
    await createAdminUser();

    // Limpiar y reinsertar productos
    await Product.deleteMany({});
    await Product.insertMany(products);
    
    console.log('Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

module.exports = initDatabase; 