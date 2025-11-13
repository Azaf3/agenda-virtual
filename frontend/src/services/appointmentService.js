import api from './api';

export const appointmentService = {
  // Listar todos os compromissos
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Buscar compromisso por ID
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Criar novo compromisso
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Atualizar compromisso
  update: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Cancelar compromisso
  cancel: async (id) => {
    const response = await api.put(`/appointments/${id}`, {
      status: 'cancelado'
    });
    return response.data;
  },

  // Deletar compromisso
  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  // Buscar compromissos por data
  getByDate: async (date) => {
    const response = await api.get(`/appointments?date=${date}`);
    return response.data;
  },

  // Buscar compromissos do mês
  getByMonth: async (year, month) => {
    const response = await api.get(`/appointments?year=${year}&month=${month}`);
    return response.data;
  },
};

export default appointmentService;
