const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Proteger rotas - verificar se usuário está autenticado
 */
exports.protect = async (req, res, next) => {
  let token;

  // Verificar se o token existe no header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado - Token não fornecido',
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Verificar se o usuário está ativo
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado - Token inválido',
    });
  }
};

/**
 * Autorizar acesso baseado em roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} não tem permissão para acessar esta rota`,
      });
    }
    next();
  };
};
