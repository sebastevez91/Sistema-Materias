const { StatusCodes } = require('http-status-codes');
const materiaService = require('../services/materiaService');

/**
 * MateriaController
 * Solo se ocupa de leer la request, delegar al servicio y formatear la response.
 */
class MateriaController {
  async getAll(req, res, next) {
    try {
      const result = await materiaService.findAll(req.query);
      res.status(StatusCodes.OK).json({ ok: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const materia = await materiaService.findById(req.params.id);
      res.status(StatusCodes.OK).json({ ok: true, data: materia });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const materia = await materiaService.create(req.body);
      res.status(StatusCodes.CREATED).json({ ok: true, data: materia });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const materia = await materiaService.update(req.params.id, req.body);
      res.status(StatusCodes.OK).json({ ok: true, data: materia });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const result = await materiaService.remove(req.params.id);
      res.status(StatusCodes.OK).json({ ok: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async toggleActiva(req, res, next) {
    try {
      const { activa } = req.body;
      const materia = await materiaService.toggleActiva(req.params.id, activa);
      res.status(StatusCodes.OK).json({ ok: true, data: materia });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MateriaController();
