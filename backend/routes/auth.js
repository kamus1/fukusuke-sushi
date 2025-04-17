const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Middleware de autenticación básica
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};

// Middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'No hay usuario autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado - Se requiere rol de administrador' });
  }

  next();
};

// Ruta POST /api/auth/register
router.post('/register', [
  check('email', 'Por favor incluye un email válido').isEmail(),
  check('password', 'La contraseña debe tener 6 o más caracteres').isLength({ min: 6 }),
  check('nombre', 'El nombre es requerido').not().isEmpty()
], async (req, res) => {
  console.log('Datos recibidos:', req.body);
  try {
    // Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Errores de validación:', errors.array());
      return res.status(400).json({ 
        msg: 'Errores de validación', 
        errors: errors.array() 
      });
    }

    const { email, password, nombre } = req.body;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ 
        msg: 'El usuario ya existe',
        field: 'email'
      });
    }

    // Crear nuevo usuario
    user = new User({
      email: email.toLowerCase(),
      password,
      nombre,
      role: 'user' // Por defecto todos los registros nuevos son usuarios normales
    });

    // Guardar usuario
    await user.save();

    // Crear JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            role: user.role
          }
        });
      }
    );

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Ruta POST /api/auth/login
router.post('/login', [
  check('email', 'Por favor incluye un email válido').isEmail(),
  check('password', 'La contraseña es requerida').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Crear y retornar JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router; 