'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'question_set_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      question_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      choice_a: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      choice_b: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      choice_c: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      choice_d: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      correct_choice: {
        type: Sequelize.STRING(1),
        allowNull: false
      },

      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Only allow A, B, C, or D as the correct choice.
    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT "ck_questions_correct_choice"
      CHECK ("correct_choice" IN ('A', 'B', 'C', 'D'));
    `);

    // Points must be zero or greater.
    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT "ck_questions_points_positive"
      CHECK ("points" >= 0);
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  }
};
