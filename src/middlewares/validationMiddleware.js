const { body, param, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// ── Helper para ejecutar las validaciones ────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ok: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Reglas de validación ─────────────────────────────────────────────────────
const crearMateriaRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido.')
    .isLength({ min: 2, max: 150 }).withMessage('El nombre debe tener entre 2 y 150 caracteres.'),
  body('codigo')
    .trim()
    .notEmpty().withMessage('El código es requerido.')
    .isLength({ max: 20 }).withMessage('El código no puede superar 20 caracteres.')
    .matches(/^[A-Z0-9\-]+$/i).withMessage('El código solo acepta letras, números y guiones.'),
  body('creditos')
    .notEmpty().withMessage('Los créditos son requeridos.')
    .isInt({ min: 1, max: 10 }).withMessage('Los créditos deben ser un entero entre 1 y 10.'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede superar 1000 caracteres.'),
  body('activa')
    .optional()
    .isBoolean().withMessage('El campo activa debe ser verdadero o falso.'),
];

const actualizarMateriaRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.'),
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage('El nombre debe tener entre 2 y 150 caracteres.'),
  body('codigo')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('El código no puede superar 20 caracteres.')
    .matches(/^[A-Z0-9\-]+$/i).withMessage('El código solo acepta letras, números y guiones.'),
  body('creditos')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Los créditos deben ser un entero entre 1 y 10.'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede superar 1000 caracteres.'),
];

const toggleActivaRules = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.'),
  body('activa')
    .notEmpty().withMessage('El campo activa es requerido.')
    .isBoolean().withMessage('El campo activa debe ser verdadero o falso.'),
];

const idParamRule = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.'),
];

module.exports = {
  validate,
  crearMateriaRules,
  actualizarMateriaRules,
  toggleActivaRules,
  idParamRule,
};
