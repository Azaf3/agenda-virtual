import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Input from '../components/Input';
import PatientHistoryModal from '../components/PatientHistoryModal';
import Loader from '../components/Loader';
import { useToast } from '../components/Toast';
import patientService from '../services/patientService';

const PacientesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '1990-01-01',
    notes: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  // Carregar pacientes do backend
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await patientService.getAll();
      setPatients(prev => {
        // Evita sobrescrever otimizações recentes: faz merge por _id
        const byId = new Map();
        prev.forEach(p => byId.set(p._id, p));
        data.forEach(p => byId.set(p._id, p));
        return Array.from(byId.values());
      });
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      showToast('Erro ao carregar pacientes', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.phone) {
      showToast('Por favor, preencha os campos obrigatórios', 'error');
      return;
    }
    
    setLoading(true);
    try {
      if (editingPatient) {
        // Atualizar paciente existente
        const updated = await patientService.update(editingPatient._id, formData);
        setPatients(prev => prev.map(p => (p._id === editingPatient._id ? updated : p)));
        await loadPatients(true);
        showToast('Paciente atualizado com sucesso!', 'success');
      } else {
        // Criar novo paciente
        const created = await patientService.create(formData);
        setPatients(prev => [created, ...prev]);
        await loadPatients(true);
        showToast('Paciente cadastrado com sucesso!', 'success');
      }
      setShowModal(false);
      resetForm();
      setSearchTerm('');
      // Atualização otimista já aplicada acima; recarga não é necessária aqui
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      showToast(error.response?.data?.message || 'Erro ao salvar paciente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patient) => {
    if (window.confirm(`Tem certeza que deseja excluir ${patient.name}?`)) {
      try {
        await patientService.delete(patient._id);
        setPatients(prev => prev.filter(p => p._id !== patient._id));
        await loadPatients(true);
        showToast('Paciente excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        showToast('Erro ao excluir paciente', 'error');
      }
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '1990-01-01',
      notes: patient.notes || '',
      emergencyContact: patient.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      }
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '1990-01-01',
      notes: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    });
    setEditingPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds([]);
  };

  const toggleSelected = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const visibleIds = filteredPatients.map(p => p._id);
    const allSelected = visibleIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      // Limpar seleção apenas dos visíveis
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Selecionar todos os visíveis, mantendo já selecionados
      const merged = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(merged));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Excluir ${selectedIds.length} paciente(s)?`)) return;
    try {
      await patientService.bulkDelete(selectedIds);
      setPatients(prev => prev.filter(p => !selectedIds.includes(p._id)));
      await loadPatients(true);
      showToast('Pacientes excluídos com sucesso!', 'success');
      setSelectedIds([]);
      setSelectMode(false);
    } catch (error) {
      console.error('Erro ao excluir pacientes:', error);
      showToast('Erro ao excluir pacientes', 'error');
    }
  };

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
              👥 Meus Pacientes
            </h1>
            <p className="text-gray-400">
              Gerencie o cadastro e histórico dos seus pacientes
            </p>
          </div>
          <div className="flex gap-3">
            {selectMode && (
              <Button variant="danger" onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
                <Trash2 size={18} />
                Excluir Selecionados ({selectedIds.length})
              </Button>
            )}
            {selectMode && (
              <Button variant="outline" onClick={handleToggleSelectAll}>
                {filteredPatients.length > 0 && filteredPatients.every(p => selectedIds.includes(p._id))
                  ? 'Limpar Seleção'
                  : 'Selecionar Todos'}
              </Button>
            )}
            <Button variant="outline" onClick={toggleSelectMode}>
              {selectMode ? 'Cancelar Seleção' : 'Selecionar'}
            </Button>
            <Button onClick={() => {
              resetForm();
              setShowModal(true);
            }}>
              <Plus size={20} />
              Novo Paciente
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">Total de Pacientes</div>
                <div className="text-3xl font-bold text-white">{patients.length}</div>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">Sessões este Mês</div>
                <div className="text-3xl font-bold text-white">
                  {patients.reduce((acc, p) => acc + (p.sessions || 0), 0)}
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary-400" />
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm mb-1">Novos este Mês</div>
                <div className="text-3xl font-bold text-white">3</div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Busca */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar paciente por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </Card>

        {/* Lista de Pacientes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                {selectMode && (
                  <div className="absolute -mt-2 -ml-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(patient._id)}
                      onChange={() => toggleSelected(patient._id)}
                      className="w-5 h-5 accent-primary-500 cursor-pointer"
                      aria-label={`Selecionar ${patient.name}`}
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {(patient.name || '?').charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(patient)}
                      className="p-2 hover:bg-primary-500/20 rounded-lg transition-all hover:scale-110"
                      title="Editar paciente"
                    >
                      <Edit size={18} className="text-primary-400 hover:text-primary-300" />
                    </button>
                    <button
                      onClick={() => handleDelete(patient)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all hover:scale-110"
                      title="Excluir paciente"
                    >
                      <Trash2 size={18} className="text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{patient.name}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail size={16} />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Phone size={16} />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={16} />
                    <span>Última sessão: {patient.lastSession ? new Date(patient.lastSession).toLocaleDateString('pt-BR') : '—'}</span>
                  </div>
                </div>

                {patient.phone && (
                  <div className="p-3 bg-white/5 rounded-lg mb-4">
                    <div className="text-sm text-gray-400 mb-1">Contato de Emergência</div>
                    <div className="text-white text-sm">
                      {patient.emergencyContact?.name || 'Não informado'}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    Cadastrado em {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </div>
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowHistoryModal(true);
                    }}
                  >
                    Ver Histórico
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">
              {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
            </p>
            <Button onClick={() => {
              resetForm();
              setShowModal(true);
            }}>
              <Plus size={18} />
              Cadastrar Primeiro Paciente
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Modal de Novo/Editar Paciente */}
      <Modal isOpen={showModal} onClose={() => {
        setShowModal(false);
        resetForm();
      }}>
        <h2 className="text-2xl font-bold text-white mb-6">
          {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="João Silva"
            icon={Users}
            required
          />
          <Input
            label="Email (opcional)"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="joao@email.com"
            icon={Mail}
          />
          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(11) 99999-9999"
            icon={Phone}
            required
          />
          <Input
            label="Data de Nascimento"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notas sobre o paciente, histórico relevante, etc."
              rows={3}
              className="w-full px-4 py-2 bg-background-component border border-border rounded-lg text-text placeholder-text-secondary/50 focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>
          
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-white mb-3">Contato de Emergência</h3>
            <div className="space-y-3">
              <Input
                label="Nome"
                name="emergency.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                placeholder="Nome do contato"
              />
              <Input
                label="Telefone"
                name="emergency.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                icon={Phone}
              />
              <Input
                label="Relação"
                name="emergency.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                placeholder="Mãe, Pai, Cônjuge, etc."
              />
            </div>
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
            <Button type="submit" fullWidth isLoading={loading}>
              {editingPatient ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Histórico */}
      <PatientHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
    </div>
  );
};

export default PacientesPage;
