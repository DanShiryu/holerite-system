const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não informado.'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({
      error: 'Token mal formatado.'
    });
  }

  const [scheme, token] = parts;

  if (scheme !== 'Bearer') {
    return res.status(401).json({
      error: 'Formato do token inválido.'
    });
  }

  try {
    const decoded = jwt.verify(token, 'segredo_super_seguro');

    req.funcionario = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado.'
    });
  }
};

module.exports = authMiddleware;