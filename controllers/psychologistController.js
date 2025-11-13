const Psychologist = require('../models/Psychologist');
const User = require('../models/User');

// @desc    Listar todos os psicólogos
// @route   GET /api/psychologists
// @access  Public
exports.getPsychologists = async (req, res) => {
  try {
    const { specialty, minPrice, maxPrice } = req.query;

    // Filtros
    let filter = {};
    if (specialty) {
      filter.specialties = { $in: [specialty] };
    }
    if (minPrice || maxPrice) {
      filter.sessionPrice = {};
      if (minPrice) filter.sessionPrice.$gte = Number(minPrice);
      if (maxPrice) filter.sessionPrice.$lte = Number(maxPrice);
    }

    const psychologists = await Psychologist.find(filter)
      .populate('user', 'name email phone avatar')
      .sort('-rating');

    res.status(200).json({
      success: true,
      count: psychologists.length,
      data: psychologists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar psicólogos',
      error: error.message,
    });
  }
};

// @desc    Obter um psicólogo específico
// @route   GET /api/psychologists/:id
// @access  Public
exports.getPsychologist = async (req, res) => {
  try {
    const psychologist = await Psychologist.findById(req.params.id)
      .populate('user', 'name email phone avatar');

    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psicólogo não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: psychologist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar psicólogo',
      error: error.message,
    });
  }
};

// @desc    Atualizar perfil do psicólogo
// @route   PUT /api/psychologists/:id
// @access  Private (Psychologist only)
exports.updatePsychologist = async (req, res) => {
  try {
    const {
      specialties,
      bio,
      experience,
      education,
      availability,
      sessionDuration,
      sessionPrice,
    } = req.body;

    const psychologist = await Psychologist.findById(req.params.id);

    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psicólogo não encontrado',
      });
    }

    // Verificar se o usuário é o dono do perfil
    if (psychologist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado',
      });
    }

    // Atualizar campos
    if (specialties) psychologist.specialties = specialties;
    if (bio) psychologist.bio = bio;
    if (experience) psychologist.experience = experience;
    if (education) psychologist.education = education;
    if (availability) psychologist.availability = availability;
    if (sessionDuration) psychologist.sessionDuration = sessionDuration;
    if (sessionPrice) psychologist.sessionPrice = sessionPrice;

    await psychologist.save();

    res.status(200).json({
      success: true,
      data: psychologist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar psicólogo',
      error: error.message,
    });
  }
};

// @desc    Obter disponibilidade do psicólogo
// @route   GET /api/psychologists/:id/availability
// @access  Public
exports.getAvailability = async (req, res) => {
  try {
    const psychologist = await Psychologist.findById(req.params.id);

    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psicólogo não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        availability: psychologist.availability,
        sessionDuration: psychologist.sessionDuration,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar disponibilidade',
      error: error.message,
    });
  }
};
