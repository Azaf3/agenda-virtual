const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  psychologist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome do paciente'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Por favor, informe o telefone'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Por favor, informe a data de nascimento'],
  },
  emergencyContact: {
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    relationship: {
      type: String,
      required: false,
    },
  },
  medicalHistory: {
    allergies: [String],
    medications: [String],
    previousTreatments: [String],
    mentalHealthHistory: String,
  },
  notes: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Atualizar updatedAt antes de salvar
patientSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
