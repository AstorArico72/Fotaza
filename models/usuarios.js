'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Usuarios.init({
    ID: DataTypes.INTEGER,
    Nombre_Usuario: DataTypes.STRING,
    Contraseña: DataTypes.STRING,
    Rol: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "User"
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Usuarios'
  });
  return Usuarios;
};