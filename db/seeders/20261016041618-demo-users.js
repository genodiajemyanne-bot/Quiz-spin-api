'use strict';

// QuizSpin seed accounts. Same school IDs as before (2099-0001 ... 2099-0006),
// because the Week 11 requests use them in the X-Demo-User header.
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const row = (school_id, full_name, email, role) => ({
      school_id, full_name, email, role,
      password_hash: 'not-a-real-hash',
      created_at: now,
    });

    await queryInterface.bulkInsert('users', [
      row('2099-0001', 'Wheel Host', 'wheel.host@quizspin.test', 'host'),
      row('2099-0002', 'Spin Master', 'spin.master@quizspin.test', 'player'),
      row('2099-0003', 'Wheel Wizard', 'wheel.wizard@quizspin.test', 'player'),
      row('2099-0004', 'Lucky Lyn', 'lucky.lyn@quizspin.test', 'player'),
      row('2099-0005', 'Pixel Pat', 'pixel.pat@quizspin.test', 'player'),
      row('2099-0006', 'Late Joiner', 'late.joiner@quizspin.test', 'player'),
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      school_id: ['2099-0001', '2099-0002', '2099-0003', '2099-0004', '2099-0005', '2099-0006'],
    }, {});
  },
};