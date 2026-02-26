'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Siguraduhing gawa na ang table
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('usergamification')) {
      await queryInterface.createTable('usergamification', {
        user_id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.INTEGER,
          references: { model: 'Users', key: 'id' },
          onDelete: 'CASCADE'
        }
      });
    }

    const tableInfo = await queryInterface.describeTable('usergamification');

    // 2. Safe add/rename para sa experience_points (dating total_points)
    if (tableInfo.total_points && !tableInfo.experience_points) {
      await queryInterface.renameColumn('usergamification', 'total_points', 'experience_points');
    } else if (!tableInfo.experience_points) {
      await queryInterface.addColumn('usergamification', 'experience_points', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
    }

    // 3. Safe add/rename para sa level (dating current_level)
    if (tableInfo.current_level && !tableInfo.level) {
      await queryInterface.renameColumn('usergamification', 'current_level', 'level');
    } else if (!tableInfo.level) {
      await queryInterface.addColumn('usergamification', 'level', {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      });
    }

    // 4. Safe add para sa streak
    if (!tableInfo.streak) {
      await queryInterface.addColumn('usergamification', 'streak', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
    }

    // 5. Siguraduhing may timestamps
    if (!tableInfo.created_at) {
      await queryInterface.addColumn('usergamification', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('usergamification', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usergamification');
  }
};