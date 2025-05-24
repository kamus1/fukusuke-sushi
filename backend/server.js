const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const flowRoutes = require('./routes/flow');
const despachoRoutes = require('./routes/despachos');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/flow', flowRoutes);
app.use('/api/despachos', despachoRoutes);

// Endpoint /api/health 
app.get('/api/health', async (req, res) => {
  const mongoState = mongoose.connection.readyState;

  res.status(200).json({
    status: 'OK',
    mongo: mongoState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});


// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error en el servidor' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app; 