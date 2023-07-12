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
    ID: DataTypes.INTEGER,
    Usuario: DataTypes.INTEGER,
    Texto_Post: DataTypes.STRING,
    Título_Post: DataTypes.STRING,
    URL_Medios: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};