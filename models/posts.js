'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posts.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Usuario: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'ID'
      }
    },
    Texto_Post: DataTypes.STRING,
    Título_Post: DataTypes.STRING,
    URL_Medios: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    URL_Miniatura: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    Etiquetas_Post: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    Licencia_Foto: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    Categoría_Post: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    Visibilidad: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Público"
    },
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
    modelName: 'Posts',
  });
  return Posts;
};