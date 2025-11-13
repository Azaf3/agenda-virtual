require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound, requestLogger } = require('./utils/errorMiddleware');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const psychologistRoutes = require('./routes/psychologistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Inicializar Express
const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API AgendaMental - Plataforma de Agendamento Psicológico',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      psychologists: '/api/psychologists',
      appointments: '/api/appointments',
    },
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/psychologists', psychologistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);

// Middleware de erro 404
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║         🧠 AgendaMental API Server 🧠                  ║
  ║                                                        ║
  ║  Servidor rodando em: http://localhost:${PORT}          ║
  ║  Ambiente: ${process.env.NODE_ENV || 'development'}                       ║
  ║                                                        ║
  ║  Endpoints disponíveis:                                ║
  ║  → POST   /api/auth/register                           ║
  ║  → POST   /api/auth/login                              ║
  ║  → GET    /api/auth/me                                 ║
  ║  → GET    /api/psychologists                           ║
  ║  → GET    /api/appointments                            ║
  ║  → POST   /api/appointments                            ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `);
  console.log(`🔍 Server listening on address:`, server.address());
});

server.on('error', (error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso!`);
  }
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Fechar servidor
  process.exit(1);
});
