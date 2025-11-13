import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Input from '../components/Input';
import { authService } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Todos os usuários são registrados como psicólogos (terapeutas)
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '(00) 00000-0000',
        role: 'psychologist', // Todos os novos usuários são terapeutas
        crp: 'CRP-00/000000', // CRP padrão
        specialties: ['Terapia Cognitivo-Comportamental']
      });
      
      // Auto-login após registro
      await authService.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    
    const strength = {
      weak: password.length < 6,
      medium: password.length >= 6 && password.length < 10,
      strong: password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password),
    };

    if (strength.strong) return { level: 'Forte', color: 'text-green-400' };
    if (strength.medium) return { level: 'Média', color: 'text-yellow-400' };
    return { level: 'Fraca', color: 'text-red-400' };
  };

  const strength = passwordStrength();

  return (
  <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Partículas de fundo - Otimizado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.2 + 0.05,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Container principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md my-8"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Logo size={48} />
          </div>
        </motion.div>

        {/* Card de Registro */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-8 shadow-2xl bg-background-component border border-border"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-orbitron font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Crie sua conta
            </h1>
            <p className="text-text-secondary">
              Comece sua jornada de saúde mental hoje
            </p>
          </div>

          {/* Erro */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400"
            >
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome completo"
              type="text"
              name="name"
              placeholder="João Silva"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <Input
              label="Telefone"
              type="tel"
              name="phone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
            />

            <div>
              <Input
                label="Senha"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />
              {strength && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-2 text-sm ${strength.color} flex items-center gap-2`}
                >
                  {strength.level === 'Forte' && <CheckCircle size={16} />}
                  Força da senha: {strength.level}
                </motion.div>
              )}
            </div>

            <Input
              label="Confirmar senha"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="font-orbitron bg-gradient-primary text-white border border-transparent shadow-md"
            >
              <span className="font-medium">Criar conta</span>
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-text-secondary">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
              >
                Faça login
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Link para voltar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-text-secondary hover:text-text transition-colors inline-flex items-center gap-2"
          >
            ← Voltar para home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
