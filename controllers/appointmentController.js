const Appointment = require('../models/Appointment');
const Psychologist = require('../models/Psychologist');
const Patient = require('../models/Patient');
const { sendEmail } = require('../utils/emailSender');
const { formatDate } = require('../utils/dateFormatter');

// @desc    Criar novo agendamento
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { patient, psychologist, appointmentDate, startTime, endTime, type, notes, status, price } = req.body;

    // Verificar se campos obrigatórios foram fornecidos
    if (!patient || !psychologist || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça todos os campos obrigatórios',
      });
    }

    // Verificar conflito de horários
    const existingAppointment = await Appointment.findOne({
      psychologist,
      appointmentDate,
      startTime,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Este horário já está reservado',
      });
    }

    // Criar agendamento
    const appointment = await Appointment.create({
      patient,
      psychologist,
      appointmentDate,
      startTime,
      endTime,
      type: type || 'online',
      notes,
      status: status || 'scheduled',
      price: price || 150,
    });

    // Enviar email de confirmação (opcional)
    // await sendEmail({
    //   to: req.user.email,
    //   subject: 'Agendamento Confirmado',
    //   text: `Seu agendamento foi confirmado para ${formatDate(appointmentDate)} às ${startTime}`,
    // });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar agendamento',
      error: error.message,
    });
  }
};

// @desc    Listar agendamentos do usuário
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const { year, month, date } = req.query;
    let filter = {};

    // Filtrar por ano e mês se fornecido
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    // Filtrar por data específica se fornecida
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.appointmentDate = { $gte: targetDate, $lt: nextDay };
    }

    // Buscar appointments com populate
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('psychologist', 'name email phone')
      .sort('appointmentDate startTime');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar agendamentos',
      error: error.message,
    });
  }
};

// @desc    Obter um agendamento específico
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'psychologist',
        populate: { path: 'user', select: 'name email phone' },
      })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email phone' },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamento',
      error: error.message,
    });
  }
};

// @desc    Atualizar status do agendamento
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const { status, psychologistNotes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
    }

    // Atualizar campos
    if (status) appointment.status = status;
    if (psychologistNotes && req.user.role === 'psychologist') {
      appointment.psychologistNotes = psychologistNotes;
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar agendamento',
      error: error.message,
    });
  }
};

// @desc    Cancelar agendamento
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user.id;
    appointment.cancellationReason = reason;
    appointment.cancelledAt = Date.now();

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Agendamento cancelado com sucesso',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar agendamento',
      error: error.message,
    });
  }
};
