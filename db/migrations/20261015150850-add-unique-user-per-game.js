
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'unique_user_per_game_session'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'players',
      'unique_user_per_game_session'
    );
  }
};
