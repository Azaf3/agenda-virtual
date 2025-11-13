import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Lock, Clock, Moon, Sun, Bell, Save } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { authService } from '../services/authService';

const ConfiguracoesPage = () => {
  const user = authService.getCurrentUser();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    sessionDuration: '50',
    workStart: '08:00',
    workEnd: '18:00',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Implementar salvamento de perfil
    alert('Perfil atualizado com sucesso!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    // Implementar mudança de senha
    alert('Senha alterada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-text mb-2">
            ⚙️ Configurações
          </h1>
          <p className="text-text-secondary">
            Personalize sua experiência e gerencie sua conta
          </p>
        </div>

        {/* Dados do Perfil */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-background-component rounded-xl flex items-center justify-center border border-border">
              <User className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Dados do Perfil</h2>
              <p className="text-sm text-text-secondary">Atualize suas informações pessoais</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={User}
            />
            <Input
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={User}
            />
            <Button type="submit">
              <Save size={18} />
              Salvar Alterações
            </Button>
          </form>
        </Card>

        {/* Configurações de Trabalho */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-background-component rounded-xl flex items-center justify-center border border-border">
              <Clock className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Horário de Trabalho</h2>
              <p className="text-sm text-text-secondary">Defina sua disponibilidade</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Duração Padrão das Sessões
              </label>
              <select
                name="sessionDuration"
                value={formData.sessionDuration}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background-component border border-border rounded-lg text-text focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="50">50 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Início do Expediente"
                type="time"
                name="workStart"
                value={formData.workStart}
                onChange={handleChange}
                icon={Clock}
              />
              <Input
                label="Fim do Expediente"
                type="time"
                name="workEnd"
                value={formData.workEnd}
                onChange={handleChange}
                icon={Clock}
              />
            </div>

            <Button>
              <Save size={18} />
              Salvar Horários
            </Button>
          </div>
        </Card>

        {/* Segurança */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-background-component rounded-xl flex items-center justify-center border border-border">
              <Lock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Segurança</h2>
              <p className="text-sm text-text-secondary">Altere sua senha</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Senha Atual"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              icon={Lock}
              placeholder="••••••••"
            />
            <Input
              label="Nova Senha"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              icon={Lock}
              placeholder="••••••••"
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              placeholder="••••••••"
            />
            <Button type="submit" variant="danger">
              <Lock size={18} />
              Alterar Senha
            </Button>
          </form>
        </Card>

        {/* Preferências */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-background-component rounded-xl flex items-center justify-center border border-border">
              <Settings className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Preferências</h2>
              <p className="text-sm text-text-secondary">Personalize sua experiência</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Modo Escuro */}
            <div className="flex items-center justify-between p-4 bg-background-component rounded-lg border border-border">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="text-primary-400" size={20} /> : <Sun className="text-yellow-400" size={20} />}
                <div>
                  <div className="text-text font-semibold">Modo Escuro</div>
                  <div className="text-sm text-text-secondary">Interface com tema escuro</div>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  darkMode ? 'bg-primary-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-background rounded-full transition-transform ${
                    darkMode ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>

            {/* Notificações */}
            <div className="flex items-center justify-between p-4 bg-background-component rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Bell className="text-secondary-400" size={20} />
                <div>
                  <div className="text-text font-semibold">Notificações</div>
                  <div className="text-sm text-text-secondary">Receber lembretes de sessões</div>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-primary-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-background rounded-full transition-transform ${
                    notifications ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfiguracoesPage;
