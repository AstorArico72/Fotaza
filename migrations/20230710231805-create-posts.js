'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ID: {
        type: Sequelize.INTEGER
      },
      Usuario: {
        type: Sequelize.INTEGER
      },
      Texto_Post: {
        type: Sequelize.STRING
      },
      Título_Post: {
        type: Sequelize.STRING
      },
      URL_Medios: {
        type: Sequelize.STRING
      },
      FechaPost: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};