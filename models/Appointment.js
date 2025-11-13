const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  psychologist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Por favor, informe a data do atendimento'],
  },
  startTime: {
    type: String, // Formato: "HH:MM"
    required: true,
  },
  endTime: {
    type: String, // Formato: "HH:MM"
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
  },
  type: {
    type: String,
    enum: ['online', 'in-person'],
    default: 'online',
  },
  meetingLink: {
    type: String,
    default: null,
  },
  meetingId: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  notes: {
    type: String,
  },
  patientNotes: {
    type: String,
  },
  psychologistNotes: {
    type: String,
    select: false, // Notas privadas do psicólogo
  },
  price: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'pix', 'cash', 'insurance'],
    default: null,
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  cancellationReason: {
    type: String,
    default: null,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  reminderSent: {
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

// Índices para melhorar performance nas consultas
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ psychologist: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

// Atualizar updatedAt antes de salvar
appointmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
