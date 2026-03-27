require('dotenv').config();
const sequelize = require('./database');
require('../models/Materia');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente.');
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
    process.exit(1);
  }
})();
