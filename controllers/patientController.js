const Patient = require('../models/Patient');

// @desc    Obter todos os pacientes do psicólogo
// @route   GET /api/patients
// @access  Private (Psychologist only)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ 
      psychologist: req.user.id,
      isActive: true 
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pacientes',
      error: error.message,
    });
  }
};

// @desc    Obter um paciente específico
// @route   GET /api/patients/:id
// @access  Private (Psychologist only)
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      psychologist: req.user.id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar paciente',
      error: error.message,
    });
  }
};

// @desc    Criar novo paciente
// @route   POST /api/patients
// @access  Private (Psychologist only)
exports.createPatient = async (req, res) => {
  try {
    console.log('📝 Dados recebidos:', JSON.stringify(req.body, null, 2));
    
    const patientData = {
      ...req.body,
      psychologist: req.user.id,
    };

    console.log('📝 Dados a serem salvos:', JSON.stringify(patientData, null, 2));
    
    const patient = await Patient.create(patientData);

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar paciente',
      error: error.message,
    });
  }
};

// @desc    Atualizar paciente
// @route   PUT /api/patients/:id
// @access  Private (Psychologist only)
exports.updatePatient = async (req, res) => {
  try {
    let patient = await Patient.findOne({
      _id: req.params.id,
      psychologist: req.user.id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
    }

    patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar paciente',
      error: error.message,
    });
  }
};

// @desc    Deletar paciente (soft delete)
// @route   DELETE /api/patients/:id
// @access  Private (Psychologist only)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      psychologist: req.user.id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
    }

    // Soft delete - marca como inativo
    patient.isActive = false;
    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Paciente removido com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar paciente',
      error: error.message,
    });
  }
};

// @desc    Deletar múltiplos pacientes (soft delete)
// @route   POST /api/patients/bulk-delete
// @access  Private (Psychologist only)
exports.bulkDeletePatients = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de IDs inválida',
      });
    }

    const result = await Patient.updateMany(
      { _id: { $in: ids }, psychologist: req.user.id },
      { isActive: false }
    );

    res.status(200).json({
      success: true,
      message: 'Pacientes removidos com sucesso',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar pacientes',
      error: error.message,
    });
  }
};
