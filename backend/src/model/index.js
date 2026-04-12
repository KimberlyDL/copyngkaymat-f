// backend/src/model/index.js
const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const db = {};

// 1. Models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Session = require('./Session')(sequelize, Sequelize.DataTypes);
db.TokenBlacklist = require('./Tokenblacklist')(sequelize, Sequelize.DataTypes);
db.UserProfile = require('./UserProfile')(sequelize, Sequelize.DataTypes);
db.UserPrivacySettings = require('./UserPrivacySettings')(sequelize, Sequelize.DataTypes);
db.UserNotificationPreferences = require('./UserNotificationPreferences')(sequelize, Sequelize.DataTypes);
db.AccountDeletionRequest = require('./AccountDeletionrequest')(sequelize, Sequelize.DataTypes);
db.File = require('./File')(sequelize, Sequelize.DataTypes);
db.Module = require('./Module')(sequelize, Sequelize.DataTypes);
db.ModuleView = require('./ModuleView')(sequelize, Sequelize.DataTypes);
db.Classroom = require('./Classroom')(sequelize, Sequelize.DataTypes);
db.ClassroomMember = require('./ClassroomMember')(sequelize, Sequelize.DataTypes);
db.Quiz = require('./Quiz')(sequelize, Sequelize.DataTypes);
db.QuizAttempt = require('./QuizAttempt')(sequelize, Sequelize.DataTypes);
db.UserGamification = require('./UserGamification')(sequelize, Sequelize.DataTypes);
db.Title = require('./Title')(sequelize, Sequelize.DataTypes);
db.Badge = require('./badge')(sequelize, Sequelize.DataTypes);
db.UserInventory = require('./UserInventory')(sequelize, Sequelize.DataTypes);
db.Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
db.Announcement = require('./Announcement')(sequelize, Sequelize.DataTypes);
db.PushSubscription = require('./PushSubscription')(sequelize, Sequelize.DataTypes);
db.MLAnalysisResult = require('./MLAnalysisResult')(sequelize, Sequelize.DataTypes);

// 2. Associations

// User ↔ Gamification
db.UserGamification.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.User.hasOne(db.UserGamification, { foreignKey: 'user_id', as: 'gamification' });

// Quiz ↔ Module — defined inside Module.associate() / Quiz.associate().
// Removed from here to avoid duplicate alias error ("quizzes" conflict).

// QuizAttempt
db.QuizAttempt.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.QuizAttempt.belongsTo(db.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
db.Quiz.hasMany(db.QuizAttempt, { foreignKey: 'quiz_id', as: 'attempts' });

// UserInventory ↔ Badge
db.UserInventory.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.UserInventory.belongsTo(db.Badge, { foreignKey: 'badge_id', as: 'badge' });
db.User.hasMany(db.UserInventory, { foreignKey: 'user_id', as: 'inventory' });
db.Badge.hasMany(db.UserInventory, { foreignKey: 'badge_id', as: 'claims' });

// Notification ↔ User
db.Notification.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.User.hasMany(db.Notification, { foreignKey: 'user_id', as: 'notifications' });

// Announcement ↔ User / Classroom
// Announcement.belongsTo(User, 'author') and belongsTo(Classroom, 'classroom')
// are defined in Announcement.associate() — only keeping the inverse sides here
// since User and Classroom models have no associate() defining these.
db.User.hasMany(db.Announcement, { foreignKey: 'created_by', as: 'announcements' });
db.Classroom.hasMany(db.Announcement, { foreignKey: 'classroom_id', as: 'classroomAnnouncements' });

// PushSubscription ↔ User
db.PushSubscription.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.User.hasMany(db.PushSubscription, { foreignKey: 'user_id', as: 'pushSubscriptions' });

// 3. Auto-associations from model files
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(`[Database] Binding associations for: ${modelName}`);
    db[modelName].associate(db);
  }
});

// 4. Sequelize instances
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 5. Notification hooks (must be last — needs all models loaded)
const { registerNotificationHooks } = require('../utils/NotificationHooks');
registerNotificationHooks(db);

module.exports = db;