const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ESTADOS_DESPACHADOR = [
  'Disponible',
  'Entregando pedido',
  'Pedido Entregado',
  'Fuera de servicio',
  'Ocupado'
];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'despachador'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Solo para rol 'despachador'
  despachador: {
    estado: {
      type: String,
      enum: ESTADOS_DESPACHADOR,
      default: 'Disponible'
    },
    disponibilidad: {
      type: Boolean,
      default: true
    }
  }
});

// middleware: eliminar campo 'despachador' si el rol no es 'despachador'
userSchema.pre('save', function (next) {
  if (this.role !== 'despachador') {
    this.despachador = undefined;
  }
  next();
});

// middleware: encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método de instancia: comparar contraseña para login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
