'use strict';

// One QuizSpin question set: the wheel lands on a category, then the player answers.
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    const [[host]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");

    await queryInterface.bulkInsert('question_sets', [{
      host_id: host.user_id,
      title: 'QuizSpin Mixed Categories',
      description: 'Five spin-the-wheel questions: science, geography, history, technology and literature.',
      created_at: new Date(),
    }]);

    const [[set]] = await db.query(
      "SELECT question_set_id FROM question_sets WHERE title = 'QuizSpin Mixed Categories'"
    );

    await queryInterface.bulkInsert('questions', [
      {
        question_set_id: set.question_set_id,
        question_text: '[Science] Which planet is known as the Red Planet?',
        choice_a: 'Venus', choice_b: 'Mars', choice_c: 'Jupiter', choice_d: 'Mercury',
        correct_choice: 'B', points: 10,
      },
      {
        question_set_id: set.question_set_id,
        question_text: '[Geography] What is the capital city of the Philippines?',
        choice_a: 'Cebu City', choice_b: 'Davao City', choice_c: 'Manila', choice_d: 'Baguio',
        correct_choice: 'C', points: 10,
      },
      {
        question_set_id: set.question_set_id,
        question_text: '[History] In what year did the Philippines declare independence from Spain?',
        choice_a: '1898', choice_b: '1946', choice_c: '1872', choice_d: '1935',
        correct_choice: 'A', points: 10,
      },
      {
        question_set_id: set.question_set_id,
        question_text: '[Technology] What does CPU stand for?',
        choice_a: 'Computer Personal Unit', choice_b: 'Central Program Utility',
        choice_c: 'Core Processing Update', choice_d: 'Central Processing Unit',
        correct_choice: 'D', points: 10,
      },
      {
        question_set_id: set.question_set_id,
        question_text: '[Literature] Who wrote the novel Noli Me Tangere?',
        choice_a: 'Andres Bonifacio', choice_b: 'Jose Rizal',
        choice_c: 'Apolinario Mabini', choice_d: 'Francisco Balagtas',
        correct_choice: 'B', points: 10,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('question_sets', { title: 'QuizSpin Mixed Categories' }, {});
  },
};