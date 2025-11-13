const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../utils/authMiddleware');

// Todas as rotas são protegidas
router.use(protect);

router.route('/')
  .post(createAppointment)
  .get(getAppointments);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(cancelAppointment);

module.exports = router;
