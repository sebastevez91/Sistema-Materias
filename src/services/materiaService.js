const { Op } = require('sequelize');
const Materia = require('../models/Materia');

/**
 * MateriaService
 * Encapsula toda la lógica de negocio relacionada con materias.
 * Principios SOLID aplicados:
 *  - SRP: este servicio sólo gestiona la lógica de materias.
 *  - OCP: se puede extender (ej. caché, eventos) sin modificar el contrato.
 *  - DIP: el controlador depende de esta abstracción, no del ORM directamente.
 */
class MateriaService {
  /**
   * Devuelve todas las materias con filtro y paginación opcionales.
   * @param {object} query - { page, limit, activa, search }
   */
  async findAll({ page = 1, limit = 10, activa, search } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (activa !== undefined) {
      where.activa = activa === 'true' || activa === true;
    }

    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { codigo: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Materia.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }

  /**
   * Busca una materia por ID.
   * @param {number} id
   */
  async findById(id) {
    const materia = await Materia.findByPk(id);
    if (!materia) {
      const err = new Error(`Materia con id ${id} no encontrada.`);
      err.statusCode = 404;
      throw err;
    }
    return materia;
  }

  /**
   * Crea una nueva materia.
   * @param {object} data - { nombre, codigo, descripcion, creditos, activa }
   */
  async create(data) {
    try {
      return await Materia.create(data);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        const error = new Error('El código de materia ya está en uso.');
        error.statusCode = 409;
        throw error;
      }
      if (err.name === 'SequelizeValidationError') {
        const error = new Error(err.errors.map((e) => e.message).join(', '));
        error.statusCode = 422;
        throw error;
      }
      throw err;
    }
  }

  /**
   * Actualiza una materia existente.
   * @param {number} id
   * @param {object} data
   */
  async update(id, data) {
    const materia = await this.findById(id);
    try {
      await materia.update(data);
      return materia;
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        const error = new Error('El código de materia ya está en uso.');
        error.statusCode = 409;
        throw error;
      }
      if (err.name === 'SequelizeValidationError') {
        const error = new Error(err.errors.map((e) => e.message).join(', '));
        error.statusCode = 422;
        throw error;
      }
      throw err;
    }
  }

  /**
   * Soft delete de una materia (paranoid: true en el modelo).
   * @param {number} id
   */
  async remove(id) {
    const materia = await this.findById(id);
    await materia.destroy();
    return { message: `Materia "${materia.nombre}" eliminada correctamente.` };
  }

  /**
   * Activa o desactiva una materia.
   * @param {number} id
   * @param {boolean} activa
   */
  async toggleActiva(id, activa) {
    const materia = await this.findById(id);
    await materia.update({ activa });
    return materia;
  }
}

module.exports = new MateriaService();
