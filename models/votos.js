'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Votos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Votos.init({
    Post: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Votos5: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Votos4: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Votos3: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Votos2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Votos1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Votos0: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Votos',
  });
  return Votos;
};