import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, User, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { useToast } from '../components/Toast';
import appointmentService from '../services/appointmentService';
import patientService from '../services/patientService';
import authService from '../services/authService';

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    patient: '',
    psychologist: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 50,
    type: 'Terapia Individual',
    notes: '',
    status: 'confirmado'
  });

  // Carregar dados do backend
  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, patientsData] = await Promise.all([
        appointmentService.getByMonth(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1
        ),
        patientService.getAll()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = authService.getCurrentUser();
      
      // Calcular endTime baseado na duração
      const [hours, minutes] = formData.time.split(':');
      const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
      const endMinutes = startMinutes + parseInt(formData.duration);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      const submitData = {
        patient: formData.patient,
        psychologist: currentUser.user?._id || currentUser._id,
        appointmentDate: formData.date,
        startTime: formData.time,
        endTime: endTime,
        type: formData.type === 'online' ? 'online' : 'in-person',
        notes: formData.notes,
        status: formData.status === 'confirmado' ? 'confirmed' : 
                formData.status === 'pendente' ? 'scheduled' : 
                'cancelled',
        price: 150 // Preço padrão de consulta
      };

      if (editingAppointment) {
        await appointmentService.update(editingAppointment._id, submitData);
        showToast('Sessão atualizada com sucesso!', 'success');
      } else {
        await appointmentService.create(submitData);
        showToast('Sessão agendada com sucesso!', 'success');
      }
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
      showToast(error.response?.data?.message || 'Erro ao salvar sessão', 'error');
    }
  };

  const handleCancel = async (appointment) => {
    if (window.confirm('Tem certeza que deseja cancelar esta sessão?')) {
      try {
        await appointmentService.cancel(appointment._id);
        showToast('Sessão cancelada com sucesso!', 'success');
        loadData();
      } catch (error) {
        console.error('Erro ao cancelar sessão:', error);
        showToast('Erro ao cancelar sessão', 'error');
      }
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    const appointmentDate = new Date(appointment.dateTime);
    setFormData({
      patient: appointment.patient._id || appointment.patient,
      psychologist: appointment.psychologist._id || appointment.psychologist,
      date: appointmentDate.toISOString().split('T')[0],
      time: appointmentDate.toTimeString().slice(0, 5),
      duration: appointment.duration || 50,
      type: appointment.type || 'Terapia Individual',
      notes: appointment.notes || '',
      status: appointment.status
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      psychologist: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 50,
      type: 'Terapia Individual',
      notes: '',
      status: 'confirmado'
    });
    setEditingAppointment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const currentMonth = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const getAppointmentColor = (status) => {
    switch (status) {
      case 'confirmado': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'pendente': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'cancelado': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-primary-500/20 border-primary-500/50 text-primary-400';
    }
  };

  // Filtrar compromissos do dia selecionado com busca e status
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    const matchesDate = aptDate.toDateString() === selectedDate.toDateString();
    
    // Filtro de busca por nome do paciente
    const patientName = apt.patient?.name || '';
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status
    const matchesStatus = statusFilter === 'todos' || 
      (statusFilter === 'confirmado' && (apt.status === 'confirmed' || apt.status === 'confirmado')) ||
      (statusFilter === 'pendente' && (apt.status === 'scheduled' || apt.status === 'pendente')) ||
      (statusFilter === 'cancelado' && (apt.status === 'cancelled' || apt.status === 'cancelado'));
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-dark-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-dark-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-orbitron font-bold text-white mb-2">
              Minha Agenda
            </h1>
            <p className="text-gray-400">Gerencie seus compromissos e sessões</p>
          </div>
          <Button onClick={() => {
            resetForm();
            setShowModal(true);
          }}>
            <Plus size={20} />
            Nova Sessão
          </Button>
        </div>

        {/* Controles de Navegação */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-white" size={20} />
              </button>
              <h2 className="text-xl font-bold text-white capitalize">{currentMonth}</h2>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronRight className="text-white" size={20} />
              </button>
            </div>

            <div className="flex gap-2">
              {['Dia', 'Semana', 'Mês'].map((mode, idx) => (
                <button
                  key={idx}
                  onClick={() => setViewMode(['day', 'week', 'month'][idx])}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === ['day', 'week', 'month'][idx]
                      ? 'bg-gradient-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Grid de Horários */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendário Lateral */}
          <Card className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Calendário</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-xs text-gray-400 font-semibold">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => (
                  <button
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                      i === 5
                        ? 'bg-gradient-primary text-white'
                        : 'hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-bold text-white mb-3">Legenda</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Confirmado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Pendente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Cancelado</span>
              </div>
            </div>
          </Card>

          {/* Lista de Compromissos */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Compromissos de {selectedDate.toLocaleDateString('pt-BR')}
              </h3>
              <span className="text-gray-400 text-sm">
                {todayAppointments.length} {todayAppointments.length === 1 ? 'sessão' : 'sessões'}
              </span>
            </div>

            {/* Busca e Filtros */}
            <Card className="mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="todos">Todos</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="pendente">Pendente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </Card>

            {todayAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border backdrop-blur-lg ${getAppointmentColor(appointment.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {appointment.patient?.name || 'Paciente'}
                      </h4>
                      <p className="text-sm opacity-80 mb-2">{appointment.type}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(appointment.dateTime).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span>{appointment.duration || 50} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(appointment)}
                      disabled={appointment.status === 'cancelado'}
                    >
                      {appointment.status === 'cancelado' ? 'Cancelado' : 'Cancelar'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {todayAppointments.length === 0 && (
              <Card className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Nenhum compromisso para esta data
                </p>
                <Button className="mt-4" onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}>
                  <Plus size={18} />
                  Agendar Sessão
                </Button>
              </Card>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal de Nova/Editar Sessão */}
      <Modal isOpen={showModal} onClose={() => {
        setShowModal(false);
        resetForm();
      }}>
        <h2 className="text-2xl font-bold text-white mb-6">
          {editingAppointment ? 'Editar Sessão' : 'Nova Sessão'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Paciente *
            </label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
              required
            >
              <option value="">Selecione um paciente</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              icon={Calendar}
              required
            />
            <Input
              label="Horário"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              icon={Clock}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duração (min)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="50"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="confirmado">Confirmado</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <Input
            label="Tipo de Atendimento"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="Ex: Terapia Cognitiva"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Notas sobre a sessão..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="glass"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              fullWidth
            >
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              {editingAppointment ? 'Atualizar' : 'Agendar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AgendaPage;
