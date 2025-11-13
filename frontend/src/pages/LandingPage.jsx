import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Shield, Sparkles, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Gestão de Agenda Inteligente',
      description:
        'Organize suas sessões, visualize compromissos e controle sua agenda profissional.',
    },
    {
      icon: Users,
      title: 'Gerenciamento de Pacientes',
      description:
        'Cadastre e acompanhe seus pacientes com histórico completo de atendimentos.',
    },
    {
      icon: Shield,
      title: 'Segurança e Privacidade',
      description:
        'Dados protegidos com criptografia, seguindo normas de sigilo profissional.',
    },
    {
      icon: Sparkles,
      title: 'Interface Profissional',
      description:
        'Plataforma moderna e intuitiva desenvolvida especialmente para terapeutas.',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Partículas ao fundo (desativadas para remover "tarja branca") */}
      {/* <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        ))}
      </div> */}

      {/* Hero */}
      <div className="relative z-10 isolate container mx-auto px-4 pt-24 sm:pt-28 lg:pt-32 pb-24 lg:pb-32">
        {/* Header */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-20 relative z-30"
        >
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="font-orbitron text-2xl font-bold text-text">MentaliQ</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-md bg-background-component text-text hover:bg-background transition-colors font-medium border border-border"
            >
              Cadastrar
            </button>
            <Button variant="glass" onClick={() => navigate('/login')} className="font-orbitron">
              Entrar
              <ArrowRight size={18} />
            </Button>
          </div>
        </motion.nav>

        {/* Conteúdo do Hero */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Esquerda */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center relative z-20"
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-orbitron font-bold mb-4 leading-tight bg-gradient-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              MentaliQ
            </motion.h1>

            <motion.h2
              className="text-xl sm:text-2xl lg:text-3xl text-text mb-8 font-light bg-transparent relative z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Organize, Cuide, Evolua.
            </motion.h2>

            <motion.p
              className="text-xl text-text-secondary mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              A plataforma completa para psicólogos, psicanalistas e terapeutas gerenciarem
              seus atendimentos com eficiência e profissionalismo.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="font-orbitron text-lg bg-gradient-primary text-white border border-transparent shadow-md"
              >
                <span className="font-medium">Começar Agora</span>
                <ArrowRight size={20} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="font-orbitron text-lg hover:bg-primary-500/10 hover:text-primary-600"
              >
                Já tenho conta
              </Button>
            </motion.div>
          </motion.div>

          {/* Direita - Ilustração */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="w-full aspect-square relative overflow-hidden z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full opacity-10 blur-3xl hidden md:block" />
              <motion.div
                className="absolute inset-10 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src="/2.svg" alt="MentaliQ" className="w-[200px] h-auto object-contain" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-orbitron font-bold text-text mb-4">Para quem é a MentaliQ?</h3>
            <p className="text-xl text-text-secondary">Feita especialmente para profissionais da saúde mental</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background-component rounded-xl p-6 hover:scale-105 transition-transform border border-border"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-text mb-2">{feature.title}</h4>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-text-secondary">
        <p className="font-orbitron">© 2025 MentaliQ. Gestão profissional para terapeutas do futuro.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
