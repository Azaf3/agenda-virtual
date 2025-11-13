const mongoose = require('mongoose');

const psychologistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  crp: {
    type: String,
    required: [true, 'Por favor, informe o CRP'],
    unique: true,
  },
  specialties: [{
    type: String,
    required: true,
  }],
  bio: {
    type: String,
    maxlength: [500, 'A bio não pode ter mais de 500 caracteres'],
  },
  experience: {
    type: String,
  },
  education: [{
    institution: String,
    degree: String,
    year: Number,
  }],
  availability: [{
    dayOfWeek: {
      type: Number, // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
      required: true,
    },
    startTime: {
      type: String, // Formato: "HH:MM"
      required: true,
    },
    endTime: {
      type: String, // Formato: "HH:MM"
      required: true,
    },
  }],
  sessionDuration: {
    type: Number, // Duração em minutos
    default: 50,
  },
  sessionPrice: {
    type: Number,
    required: [true, 'Por favor, informe o valor da sessão'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
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
psychologistSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Psychologist', psychologistSchema);
