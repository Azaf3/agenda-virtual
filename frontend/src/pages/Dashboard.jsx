import { useState, useEffect, memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { authService } from '../services/authService';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    nextAppointment: 'Nenhuma sessão agendada',
    totalPatients: 0,
    completedSessions: 0,
    pendingSessions: 0,
    thisMonthSessions: 0,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patients, appointments] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
      ]);

      // Filtrar sessões futuras e ordenar por data
      const now = new Date();
      const futureAppointments = appointments
        .filter(apt => new Date(apt.appointmentDate) >= now)
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

      // Próxima sessão
      const nextAppt = futureAppointments[0];
      const nextAppointmentText = nextAppt
        ? `${new Date(nextAppt.appointmentDate).toLocaleDateString('pt-BR')} às ${nextAppt.startTime}`
        : 'Nenhuma sessão agendada';

      // Sessões completadas
      const completedCount = appointments.filter(
        apt => apt.status === 'completed'
      ).length;

      // Sessões pendentes
      const pendingCount = appointments.filter(
        apt => apt.status === 'scheduled' || apt.status === 'confirmed'
      ).length;

      // Sessões deste mês
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const thisMonthCount = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
      }).length;

      setStats({
        nextAppointment: nextAppointmentText,
        totalPatients: patients.length,
        completedSessions: completedCount,
        pendingSessions: pendingCount,
        thisMonthSessions: thisMonthCount,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dados para gráficos
  const sessionsPerMonth = [
    { month: 'Jan', sessoes: 32 },
    { month: 'Fev', sessoes: 38 },
    { month: 'Mar', sessoes: 41 },
    { month: 'Abr', sessoes: 35 },
    { month: 'Mai', sessoes: 42 },
    { month: 'Jun', sessoes: 48 },
  ];

  const sessionsByType = [
    { name: 'Terapia Cognitiva', value: 45, color: '#3b82f6' },
    { name: 'Acompanhamento', value: 30, color: '#8b5cf6' },
    { name: 'Avaliação Inicial', value: 15, color: '#10b981' },
    { name: 'Outros', value: 10, color: '#f59e0b' },
  ];

  const weeklyHours = [
    { day: 'Seg', horas: 8 },
    { day: 'Ter', horas: 7 },
    { day: 'Qua', horas: 9 },
    { day: 'Qui', horas: 6 },
    { day: 'Sex', horas: 8 },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Início', path: '/dashboard', active: true },
    { icon: Calendar, label: 'Agenda', path: '/agenda' },
    { icon: Users, label: 'Pacientes', path: '/pacientes' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
  <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-background-component border-r border-border p-6 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <img src="/logo-mentaliQ.svg" alt="MentaliQ" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-orbitron text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            MentaliQ
          </span>
        </div>

    {/* User Info */}
  <div className="mb-8 p-4 bg-background-component rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-text font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-text font-semibold">{user?.name}</div>
              <div className="text-text-secondary text-sm">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
  <nav className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ x: 5 }}
              onClick={() => item.path && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-gradient-primary text-white'
                  : 'text-text-secondary hover:text-text hover:bg-background-component'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <Button
          variant="danger"
          onClick={handleLogout}
          className="w-full bg-gradient-accent bg-clip-text text-transparent border-2 border-accent drop-shadow-md"
        >
          <span className="bg-gradient-accent bg-clip-text text-transparent">Sair</span>
          <LogOut size={18} />
        </Button>
      </motion.aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main Content */}
  <main className="flex-1 p-8 overflow-auto bg-background-component">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-orbitron font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Bem-vindo, Dr(a). {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-text-secondary text-lg">
              Gerencie seus atendimentos e pacientes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-text-secondary text-sm mb-2">
                    Próxima Sessão
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">
                    {stats.nextAppointment}
                  </div>
                  <button 
                    onClick={() => navigate('/pacientes')} 
                    className="text-primary-400 text-sm hover:text-primary-500 hover:underline transition-colors cursor-pointer"
                  >
                    Paciente: João Silva
                  </button>
                </div>
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-400" />
                </div>
              </div>
            </Card>

            <Card hover className="cursor-pointer" onClick={() => navigate('/pacientes')}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-text-secondary text-sm mb-2">
                    Total de Pacientes
                  </div>
                  <div className="text-2xl font-bold text-text mb-1 hover:text-secondary-500 transition-colors">
                    {stats.totalPatients}
                  </div>
                  <div className="text-secondary-400 text-sm flex items-center gap-1">
                    <TrendingUp size={14} />
                    +3 este mês
                  </div>
                </div>
                <div className="w-12 h-12 bg-secondary-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary-400" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-text-secondary text-sm mb-2">
                    Sessões deste Mês
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">
                    {stats.thisMonthSessions}
                  </div>
                  <div className="text-green-400 text-sm flex items-center gap-1">
                    <CheckCircle size={14} />
                    {stats.pendingSessions} pendentes
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <h2 className="text-2xl font-orbitron font-bold text-text mb-6">
              Atividade Recente
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'João Silva - Terapia Cognitiva',
                  time: 'Hoje às 14:00',
                  status: 'Confirmado',
                  color: 'text-primary-400',
                },
                {
                  title: 'Maria Santos - Sessão de Acompanhamento',
                  time: 'Ontem às 10:00',
                  status: 'Concluído',
                  color: 'text-green-400',
                },
                {
                  title: 'Pedro Costa - Avaliação Inicial',
                  time: '20/01 às 15:00',
                  status: 'Concluído',
                  color: 'text-green-400',
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-background-component rounded-lg border border-border hover:bg-background transition-colors"
                >
                  <div>
                    <div className="text-text font-semibold">
                      {activity.title}
                    </div>
                    <div className="text-text-secondary text-sm">{activity.time}</div>
                  </div>
                  <div className={`${activity.color} font-medium`}>
                    {activity.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Gráficos */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {/* Sessões por Mês */}
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-400" />
                </div>
                <h2 className="text-xl font-orbitron font-bold text-text">
                  Sessões por Mês
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="sessoes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Tipos de Atendimento */}
            <Card>
              <h2 className="text-xl font-orbitron font-bold text-text mb-6">
                Tipos de Atendimento
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sessionsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sessionsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Horas Trabalhadas na Semana */}
            <Card className="lg:col-span-2">
              <h2 className="text-xl font-orbitron font-bold text-text mb-6">
                Horas Trabalhadas esta Semana
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="horas"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
