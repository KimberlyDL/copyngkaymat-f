'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('push_subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'   // subscriptions die with the user account
      },
      endpoint: {
  type: Sequelize.STRING(500),
  allowNull: false,
  unique: true
},
p256dh: {
  type: Sequelize.STRING(500),
  allowNull: false
},
auth: {
  type: Sequelize.STRING(100),
  allowNull: false
},
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Index for fast lookups by user when sending push notifications
    await queryInterface.addIndex('push_subscriptions', ['user_id'], {
      name: 'push_subscriptions_user_id_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('push_subscriptions');
  }
};
