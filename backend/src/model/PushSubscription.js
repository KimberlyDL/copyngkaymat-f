// backend/src/model/PushSubscription.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const PushSubscription = sequelize.define('PushSubscription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // The push service URL assigned to this device/browser
   endpoint: {
  type: DataTypes.STRING(500),
  allowNull: false,
  unique: true
},
p256dh: {
  type: DataTypes.STRING(500),
  allowNull: false
},
auth: {
  type: DataTypes.STRING(100),
  allowNull: false
},
  }, 
  
  {
    tableName: 'push_subscriptions',
    underscored: true,   // created_at / updated_at snake_case, matches your other models
    timestamps: true
  });

  return PushSubscription;
};