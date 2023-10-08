'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comentarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comentarios.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    ID_Post: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts',
        key: 'ID'
      }
    },
    ID_Usuario: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'ID'
        }
      },
    Texto_Comentario: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Comentarios',
  });
  return Comentarios;
};