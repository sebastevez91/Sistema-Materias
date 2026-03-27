const { StatusCodes } = require('http-status-codes');

/**
 * Middleware de manejo global de errores.
 * Centraliza las respuestas de error para toda la aplicación.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Error interno del servidor.';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${status}: ${message}`);
  }

  res.status(status).json({
    ok: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
