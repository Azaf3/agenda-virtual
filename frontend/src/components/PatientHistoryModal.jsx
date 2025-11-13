import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, FileText, TrendingUp } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Loader from './Loader';
import appointmentService from '../services/appointmentService';

const PatientHistoryModal = ({ isOpen, onClose, patient }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patient) {
      loadPatientSessions();
    }
  }, [isOpen, patient]);

  const loadPatientSessions = async () => {
    try {
      setLoading(true);
      const appointments = await appointmentService.getAll();
      // Filtrar sessões do paciente e ordenar por data (mais recente primeiro)
      const patientSessions = appointments
        .filter(apt => apt.patient?._id === patient._id || apt.patient === patient._id)
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      setSessions(patientSessions);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const mockSessions = [
    {
      id: 1,
      date: '2025-11-05',
      time: '14:00',
      duration: '50 min',
      type: 'Terapia Cognitiva',
      notes: 'Paciente apresentou boa evolução. Trabalhamos técnicas de respiração e reestruturação cognitiva.',
      mood: 'Bom',
    },
    {
      id: 2,
      date: '2025-10-29',
      time: '14:00',
      duration: '50 min',
      type: 'Acompanhamento',
      notes: 'Discussão sobre situações de ansiedade no trabalho. Paciente relatou melhora.',
      mood: 'Regular',
    },
    {
      id: 3,
      date: '2025-10-22',
      time: '14:00',
      duration: '50 min',
      type: 'Avaliação Inicial',
      notes: 'Primeira sessão. Anamnese realizada. Paciente busca tratamento para ansiedade.',
      mood: 'Ansioso',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
  className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background-component rounded-2xl shadow-2xl"
      >
  <div className="sticky top-0 z-10 bg-gradient-primary p-6 rounded-t-2xl border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-orbitron font-bold mb-1 bg-gradient-primary bg-clip-text text-transparent">
                Histórico do Paciente
              </h2>
              <p className="text-text-secondary">{patient?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <X className="text-text" size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Estatísticas Rápidas */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-text">{patient?.sessions || 0}</div>
              <div className="text-sm text-text-secondary">Sessões Realizadas</div>
            </Card>
            <Card className="text-center">
              <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-text">50 min</div>
              <div className="text-sm text-text-secondary">Duração Média</div>
            </Card>
            <Card className="text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-text">87%</div>
              <div className="text-sm text-text-secondary">Taxa de Presença</div>
            </Card>
          </div>

          {/* Timeline de Sessões */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Histórico de Sessões</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : sessions.length === 0 ? (
              <Card className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">Nenhuma sessão registrada ainda</p>
              </Card>
            ) : (
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="relative">
                    {/* Linha de conexão */}
                    {index < sessions.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-primary" />
                    )}

                    <div className="flex gap-4">
                      {/* Bullet Point */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-text font-bold relative z-10">
                          {index + 1}
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">{session.type || 'Sessão'}</h4>
                            <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(session.appointmentDate).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {session.startTime}
                              </span>
                              <span>{session.duration || 50} min</span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            session.status === 'completed' || session.status === 'confirmado' ? 'bg-green-500/20 text-green-400' :
                            session.status === 'confirmed' || session.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {session.status === 'completed' ? 'Concluída' :
                             session.status === 'confirmed' || session.status === 'confirmado' ? 'Confirmada' :
                             session.status === 'scheduled' ? 'Agendada' : 'Cancelada'}
                          </div>
                        </div>

                        {session.notes && (
                        <div className="bg-background rounded-lg p-3 mt-3">
                          <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                            <FileText size={14} />
                            <span className="font-semibold">Anotações</span>
                          </div>
                          <p className="text-text text-sm">{session.notes}</p>
                        </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </div>

  <div className="sticky bottom-0 bg-background-component p-6 border-t border-border rounded-b-2xl">
          <Button onClick={onClose} variant="glass" fullWidth>
            Fechar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientHistoryModal;
