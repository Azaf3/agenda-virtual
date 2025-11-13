const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePatientProfile,
  changePassword,
} = require('../controllers/userController');
const { protect, authorize } = require('../utils/authMiddleware');

// Todas as rotas são protegidas
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.put('/patient-profile', authorize('patient'), updatePatientProfile);
router.put('/change-password', changePassword);

module.exports = router;
