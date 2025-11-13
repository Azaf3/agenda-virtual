const User = require('../models/User');
const Patient = require('../models/Patient');

// @desc    Obter perfil do usuário
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let profile = { user };

    if (user.role === 'patient') {
      const patient = await Patient.findOne({ user: user._id });
      profile.patientInfo = patient;
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar perfil',
      error: error.message,
    });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil',
      error: error.message,
    });
  }
};

// @desc    Atualizar perfil do paciente
// @route   PUT /api/users/patient-profile
// @access  Private (Patient only)
exports.updatePatientProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      emergencyContact,
      medicalHistory,
      preferredTherapyType,
    } = req.body;

    let patient = await Patient.findOne({ user: req.user.id });

    // Se não existe, criar perfil de paciente
    if (!patient) {
      patient = await Patient.create({
        user: req.user.id,
        dateOfBirth: dateOfBirth || new Date('1990-01-01'),
        emergencyContact: emergencyContact || {
          name: 'Não informado',
          phone: '(00) 00000-0000',
          relationship: 'Não informado',
        },
      });
    }

    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    if (preferredTherapyType) patient.preferredTherapyType = preferredTherapyType;

    await patient.save();

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil de paciente',
      error: error.message,
    });
  }
};

// @desc    Alterar senha
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Verificar senha atual
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar senha',
      error: error.message,
    });
  }
};
