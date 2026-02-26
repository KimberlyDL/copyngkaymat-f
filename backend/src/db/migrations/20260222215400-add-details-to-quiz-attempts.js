'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('QuizAttempts');

    // Safe add para sa correct_answers
    if (!tableInfo.correct_answers) {
      await queryInterface.addColumn('QuizAttempts', 'correct_answers', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
    }

    // Safe add para sa total_questions
    if (!tableInfo.total_questions) {
      await queryInterface.addColumn('QuizAttempts', 'total_questions', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
    }

    // Safe add para sa time_taken
    if (!tableInfo.time_taken) {
      await queryInterface.addColumn('QuizAttempts', 'time_taken', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
    }

    // Siguraduhing may timestamps na kailangan ng Sequelize
    if (!tableInfo.created_at) {
      await queryInterface.addColumn('QuizAttempts', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('QuizAttempts', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('QuizAttempts');
    if (tableInfo.correct_answers) await queryInterface.removeColumn('QuizAttempts', 'correct_answers');
    if (tableInfo.total_questions) await queryInterface.removeColumn('QuizAttempts', 'total_questions');
    if (tableInfo.time_taken) await queryInterface.removeColumn('QuizAttempts', 'time_taken');
    if (tableInfo.created_at) await queryInterface.removeColumn('QuizAttempts', 'created_at');
    if (tableInfo.updated_at) await queryInterface.removeColumn('QuizAttempts', 'updated_at');
  }
};