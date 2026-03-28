const express = require('express');
const materiaRoutes = require('./routes/materiaRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');

const app = express();

// ── Parseo de body ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ ok: true, message: 'API funcionando correctamente.' });
});

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/materias', materiaRoutes);

// ── Ruta no encontrada ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ ok: false, error: 'Ruta no encontrada.' });
});

// ── Manejo global de errores ──────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
