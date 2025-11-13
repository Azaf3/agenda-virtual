const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  bulkDeletePatients,
} = require('../controllers/patientController');
const { protect, authorize } = require('../utils/authMiddleware');

// Todas as rotas são protegidas e apenas para psicólogos
router.use(protect);
router.use(authorize('psychologist'));

// Exclusão em lote (precisa vir antes de ":id" para não conflitar)
router.post('/bulk-delete', bulkDeletePatients);

router.route('/')
  .get(getAllPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

module.exports = router;
