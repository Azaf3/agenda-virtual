import api from './api';

export const patientService = {
  // Listar todos os pacientes do psicólogo logado
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data.data; // Backend retorna { success, data, count }
  },

  // Buscar paciente por ID
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data.data;
  },

  // Criar novo paciente (ficha)
  create: async (patientData) => {
    const response = await api.post('/patients', {
      name: patientData.name,
      email: patientData.email || '',
      phone: patientData.phone,
      dateOfBirth: patientData.dateOfBirth || '1990-01-01',
      emergencyContact: patientData.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      notes: patientData.notes || '',
      medicalHistory: patientData.medicalHistory || {
        allergies: [],
        medications: [],
        previousTreatments: [],
        mentalHealthHistory: ''
      }
    });
    return response.data.data;
  },

  // Atualizar paciente
  update: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data.data;
  },

  // Deletar paciente (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  // Deletar múltiplos pacientes (soft delete)
  bulkDelete: async (ids) => {
    const response = await api.post('/patients/bulk-delete', { ids });
    return response.data;
  },

  // Buscar histórico de sessões do paciente
  getHistory: async (patientId) => {
    const response = await api.get(`/appointments?patient=${patientId}`);
    return response.data;
  },
};

export default patientService;
