const request = require('supertest');
const app = require('../src/app');
const materiaService = require('../src/services/materiaService');

// ── Mock del servicio para no necesitar BD en tests ───────────────────────────
jest.mock('../src/services/materiaService');

const materiaMock = {
  id: 1,
  nombre: 'Matemática Discreta',
  codigo: 'MAT-101',
  descripcion: 'Fundamentos de matemática discreta.',
  creditos: 4,
  activa: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ═════════════════════════════════════════════════════════════════════════════
describe('GET /api/materias', () => {
  it('debe retornar lista paginada de materias', async () => {
    materiaService.findAll.mockResolvedValue({
      total: 1,
      page: 1,
      totalPages: 1,
      data: [materiaMock],
    });

    const res = await request(app).get('/api/materias');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.total).toBe(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('GET /api/materias/:id', () => {
  it('debe retornar una materia por id', async () => {
    materiaService.findById.mockResolvedValue(materiaMock);

    const res = await request(app).get('/api/materias/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.codigo).toBe('MAT-101');
  });

  it('debe retornar 404 si la materia no existe', async () => {
    const err = new Error('Materia con id 999 no encontrada.');
    err.statusCode = 404;
    materiaService.findById.mockRejectedValue(err);

    const res = await request(app).get('/api/materias/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  it('debe retornar 422 si el id no es un entero positivo', async () => {
    const res = await request(app).get('/api/materias/abc');
    expect(res.statusCode).toBe(422);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('POST /api/materias', () => {
  it('debe crear una materia correctamente', async () => {
    materiaService.create.mockResolvedValue(materiaMock);

    const res = await request(app).post('/api/materias').send({
      nombre: 'Matemática Discreta',
      codigo: 'MAT-101',
      creditos: 4,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.id).toBe(1);
  });

  it('debe retornar 422 si faltan campos requeridos', async () => {
    const res = await request(app).post('/api/materias').send({ nombre: 'Solo nombre' });
    expect(res.statusCode).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('debe retornar 422 si los créditos están fuera de rango', async () => {
    const res = await request(app).post('/api/materias').send({
      nombre: 'Test',
      codigo: 'TST-01',
      creditos: 15,
    });
    expect(res.statusCode).toBe(422);
  });

  it('debe retornar 409 si el código ya existe', async () => {
    const err = new Error('El código de materia ya está en uso.');
    err.statusCode = 409;
    materiaService.create.mockRejectedValue(err);

    const res = await request(app).post('/api/materias').send({
      nombre: 'Materia Duplicada',
      codigo: 'MAT-101',
      creditos: 3,
    });
    expect(res.statusCode).toBe(409);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('PUT /api/materias/:id', () => {
  it('debe actualizar una materia correctamente', async () => {
    const actualizada = { ...materiaMock, nombre: 'Matemática Avanzada' };
    materiaService.update.mockResolvedValue(actualizada);

    const res = await request(app).put('/api/materias/1').send({ nombre: 'Matemática Avanzada' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.nombre).toBe('Matemática Avanzada');
  });

  it('debe retornar 404 si la materia no existe', async () => {
    const err = new Error('Materia con id 999 no encontrada.');
    err.statusCode = 404;
    materiaService.update.mockRejectedValue(err);

    const res = await request(app).put('/api/materias/999').send({ creditos: 3 });
    expect(res.statusCode).toBe(404);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('PATCH /api/materias/:id/toggle', () => {
  it('debe cambiar el estado activa de la materia', async () => {
    const desactivada = { ...materiaMock, activa: false };
    materiaService.toggleActiva.mockResolvedValue(desactivada);

    const res = await request(app)
      .patch('/api/materias/1/toggle')
      .send({ activa: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.activa).toBe(false);
  });

  it('debe retornar 422 si falta el campo activa', async () => {
    const res = await request(app).patch('/api/materias/1/toggle').send({});
    expect(res.statusCode).toBe(422);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('DELETE /api/materias/:id', () => {
  it('debe eliminar una materia (soft delete)', async () => {
    materiaService.remove.mockResolvedValue({
      message: 'Materia "Matemática Discreta" eliminada correctamente.',
    });

    const res = await request(app).delete('/api/materias/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.message).toContain('eliminada');
  });

  it('debe retornar 404 si la materia no existe', async () => {
    const err = new Error('Materia con id 99 no encontrada.');
    err.statusCode = 404;
    materiaService.remove.mockRejectedValue(err);

    const res = await request(app).delete('/api/materias/99');
    expect(res.statusCode).toBe(404);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('Rutas no existentes', () => {
  it('debe retornar 404 para rutas desconocidas', async () => {
    const res = await request(app).get('/api/noexiste');
    expect(res.statusCode).toBe(404);
  });
});
