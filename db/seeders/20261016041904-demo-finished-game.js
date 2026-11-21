'use strict';

// One finished QuizSpin game: four players, each with the answers they gave.
// Correct answers are worth 10 points, so each score below matches the answers.
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    const [[set]] = await db.query(
      "SELECT question_set_id FROM question_sets WHERE title = 'QuizSpin Mixed Categories'"
    );
    const [users] = await db.query("SELECT user_id, school_id FROM users WHERE school_id LIKE '2099-%'");
    const uid = {};
    users.forEach((u) => { uid[u.school_id] = u.user_id; });

    await queryInterface.bulkInsert('game_sessions', [{
      question_set_id: set.question_set_id,
      join_code: '620417',
      status: 'completed',
      created_at: new Date('2026-10-12T02:25:00Z'),
      started_at: new Date('2026-10-12T02:30:00Z'),
      ended_at: new Date('2026-10-12T02:45:00Z'),
    }]);

    const [[session]] = await db.query("SELECT session_id FROM game_sessions WHERE join_code = '620417'");
    const joined = new Date('2026-10-12T02:27:00Z');

    await queryInterface.bulkInsert('players', [
      { session_id: session.session_id, user_id: uid['2099-0002'], nickname: 'SpinMaster', score: 50, joined_at: joined },
      { session_id: session.session_id, user_id: uid['2099-0003'], nickname: 'WheelWiz', score: 30, joined_at: joined },
      { session_id: session.session_id, user_id: uid['2099-0004'], nickname: 'LuckyLyn', score: 20, joined_at: joined },
      { session_id: session.session_id, user_id: uid['2099-0005'], nickname: 'PixelPat', score: 10, joined_at: joined },
    ]);

    const [players] = await db.query(
      'SELECT player_id, nickname FROM players WHERE session_id = :sid',
      { replacements: { sid: session.session_id } }
    );
    const pid = {};
    players.forEach((p) => { pid[p.nickname] = p.player_id; });

    const [questions] = await db.query(
      'SELECT question_id, correct_choice FROM questions WHERE question_set_id = :qs ORDER BY question_id',
      { replacements: { qs: set.question_set_id } }
    );

    const answer = (nickname, q, choice) => ({
      player_id: pid[nickname],
      question_id: q.question_id,
      submitted_choice: choice,
      is_correct: choice === q.correct_choice,
      points_awarded: choice === q.correct_choice ? 10 : 0,
      answered_at: new Date('2026-10-12T02:36:00Z'),
    });

    // Correct choices of the five questions: B, C, A, D, B
    await queryInterface.bulkInsert('answers', [
      answer('SpinMaster', questions[0], 'B'), answer('SpinMaster', questions[1], 'C'),
      answer('SpinMaster', questions[2], 'A'), answer('SpinMaster', questions[3], 'D'),
      answer('SpinMaster', questions[4], 'B'),                                   // 50

      answer('WheelWiz', questions[0], 'B'), answer('WheelWiz', questions[1], 'C'),
      answer('WheelWiz', questions[2], 'A'), answer('WheelWiz', questions[3], 'A'),
      answer('WheelWiz', questions[4], 'A'),                                     // 30

      answer('LuckyLyn', questions[0], 'B'), answer('LuckyLyn', questions[1], 'A'),
      answer('LuckyLyn', questions[2], 'C'), answer('LuckyLyn', questions[3], 'D'),
      answer('LuckyLyn', questions[4], 'C'),                                     // 20

      answer('PixelPat', questions[0], 'A'), answer('PixelPat', questions[1], 'C'), // 10
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('game_sessions', { join_code: '620417' }, {});
  },
};