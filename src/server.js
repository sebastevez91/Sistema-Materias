require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
require('./models/Materia'); // registrar modelo

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos.');

    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados.');

    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
      console.log(` Endpoints disponibles:`);
      console.log(`   GET    /api/materias`);
      console.log(`   GET    /api/materias/:id`);
      console.log(`   POST   /api/materias`);
      console.log(`   PUT    /api/materias/:id`);
      console.log(`   PATCH  /api/materias/:id`);
      console.log(`   PATCH  /api/materias/:id/toggle`);
      console.log(`   DELETE /api/materias/:id`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar la aplicación:', error);
    process.exit(1);
  }
})();
