const { Router } = require('express');
const materiaController = require('../controllers/materiaController');
const {
  validate,
  crearMateriaRules,
  actualizarMateriaRules,
  toggleActivaRules,
  idParamRule,
} = require('../middlewares/validationMiddleware');

const router = Router();

/**
 * @route   GET /api/materias
 * @desc    Listar materias con paginación y filtros
 * @query   page, limit, activa, search
 */
router.get('/', materiaController.getAll);

/**
 * @route   GET /api/materias/:id
 * @desc    Obtener una materia por ID
 */
router.get('/:id', idParamRule, validate, materiaController.getById);

/**
 * @route   POST /api/materias
 * @desc    Crear una nueva materia
 */
router.post('/', crearMateriaRules, validate, materiaController.create);

/**
 * @route   PUT /api/materias/:id
 * @desc    Actualizar una materia completa
 */
router.put('/:id', actualizarMateriaRules, validate, materiaController.update);

/**
 * @route   PATCH /api/materias/:id
 * @desc    Actualización parcial de una materia
 */
router.patch('/:id', actualizarMateriaRules, validate, materiaController.update);

/**
 * @route   PATCH /api/materias/:id/toggle
 * @desc    Activar / desactivar una materia
 */
router.patch('/:id/toggle', toggleActivaRules, validate, materiaController.toggleActiva);

/**
 * @route   DELETE /api/materias/:id
 * @desc    Eliminar (soft delete) una materia
 */
router.delete('/:id', idParamRule, validate, materiaController.remove);

module.exports = router;
