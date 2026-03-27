const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Materia extends Model {}

Materia.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío.' },
        len: { args: [2, 150], msg: 'El nombre debe tener entre 2 y 150 caracteres.' },
      },
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: { msg: 'El código de materia ya existe.' },
      validate: {
        notEmpty: { msg: 'El código no puede estar vacío.' },
        is: {
          args: /^[A-Z0-9\-]+$/i,
          msg: 'El código solo puede contener letras, números y guiones.',
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creditos: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Los créditos deben ser al menos 1.' },
        max: { args: [10], msg: 'Los créditos no pueden superar 10.' },
      },
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Materia',
    tableName: 'materias',
    timestamps: true,
    paranoid: true, // soft delete: agrega deletedAt
  }
);

module.exports = Materia;
