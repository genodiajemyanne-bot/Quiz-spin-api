'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'school_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'student'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'school_id');
  }
};