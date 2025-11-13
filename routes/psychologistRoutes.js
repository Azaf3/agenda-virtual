const express = require('express');
const router = express.Router();
const {
  getPsychologists,
  getPsychologist,
  updatePsychologist,
  getAvailability,
} = require('../controllers/psychologistController');
const { protect, authorize } = require('../utils/authMiddleware');

router.get('/', getPsychologists);
router.get('/:id', getPsychologist);
router.get('/:id/availability', getAvailability);

// Rotas protegidas
router.put('/:id', protect, authorize('psychologist', 'admin'), updatePsychologist);

module.exports = router;
