# Sistema de Gestión de Materias

API REST para la gestión de materias académicas construida con **Node.js · Express · Sequelize · MySQL**.

---

## Arquitectura

```
sistema-materias/
├── src/
│   ├── app.js                  # Configuración Express
│   ├── server.js               # Punto de entrada (DB + listen)
│   ├── config/
│   │   ├── database.js         # Instancia Sequelize
│   │   └── sync.js             # Script de sincronización
│   ├── models/
│   │   └── Materia.js          # Modelo Sequelize (paranoid)
│   ├── services/
│   │   └── materiaService.js   # Lógica de negocio (SOLID)
│   ├── controllers/
│   │   └── materiaController.js
│   ├── middlewares/
│   │   ├── validationMiddleware.js
│   │   └── errorHandler.js
│   └── routes/
│       └── materiaRoutes.js
└── tests/
    └── materias.test.js
```

### Principios SOLID aplicados

| Principio | Implementación |
|-----------|---------------|
| **SRP** | Controller solo maneja HTTP; Service contiene toda la lógica |
| **OCP** | Service exporta una instancia extendible sin modificar rutas |
| **LSP** | Los middlewares respetan el contrato `(req, res, next)` |
| **ISP** | Validaciones separadas por operación (crear vs actualizar) |
| **DIP** | Controller depende de la interfaz del Service, no del ORM |

---

## Puesta en marcha

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales MySQL
```

### 3. Crear la base de datos en MySQL
```sql
CREATE DATABASE sistema_materias CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Iniciar el servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor corre en `http://localhost:3000`.

---

## 📡 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/materias` | Listar materias (paginado + filtros) |
| `GET` | `/api/materias/:id` | Obtener una materia |
| `POST` | `/api/materias` | Crear materia |
| `PUT` | `/api/materias/:id` | Actualizar materia completa |
| `PATCH` | `/api/materias/:id` | Actualización parcial |
| `PATCH` | `/api/materias/:id/toggle` | Activar / desactivar |
| `DELETE` | `/api/materias/:id` | Eliminar (soft delete) |

### Query params en GET /api/materias
| Param | Tipo | Descripción |
|-------|------|-------------|
| `page` | number | Página (default: 1) |
| `limit` | number | Items por página (default: 10) |
| `activa` | boolean | Filtrar por estado |
| `search` | string | Buscar en nombre o código |

---

## Ejemplos de uso

### Crear una materia
```http
POST /api/materias
Content-Type: application/json

{
  "nombre": "Algoritmos y Estructuras de Datos",
  "codigo": "AED-201",
  "descripcion": "Estudio de algoritmos fundamentales.",
  "creditos": 6
}
```

### Respuesta exitosa
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "nombre": "Algoritmos y Estructuras de Datos",
    "codigo": "AED-201",
    "creditos": 6,
    "activa": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Listar con filtros
```http
GET /api/materias?page=1&limit=5&activa=true&search=mat
```

### Activar / desactivar
```http
PATCH /api/materias/1/toggle
Content-Type: application/json

{ "activa": false }
```

---

## Tests

```bash
# Ejecutar todos los tests
npm test

# Con reporte de cobertura
npm run test:coverage
```

Los tests usan **Jest + Supertest** y mockean el servicio para no requerir base de datos.

---

## Validaciones del modelo

| Campo | Reglas |
|-------|--------|
| `nombre` | Requerido · 2–150 chars |
| `codigo` | Requerido · único · máx 20 chars · solo letras/números/guiones |
| `creditos` | Requerido · entero 1–10 |
| `descripcion` | Opcional · máx 1000 chars |
| `activa` | Boolean · default `true` |

---

## ⚙️ Stack tecnológico

- **Node.js** — runtime
- **Express 4** — framework HTTP
- **Sequelize 6** — ORM para MySQL
- **mysql2** — driver MySQL
- **express-validator** — validación de inputs
- **http-status-codes** — códigos HTTP semánticos
- **Jest + Supertest** — testing
- **nodemon** — recarga en desarrollo
