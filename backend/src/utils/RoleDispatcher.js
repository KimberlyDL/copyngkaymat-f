// backend/src/utils/RoleDispatcher.js
//
// Thin routing layer — decides WHO receives a notification and
// delegates to NotificationController for actual creation + SSE + push.

const NotificationController = require('../controller/NotificationController');


const RoleDispatcher = {

  /** Single player */
  async notifyPlayer(playerId, payload) {
    return NotificationController.create(playerId, payload);
  },

  /** Many players at once (platform-wide announcements, classroom blasts) */
  async notifyManyPlayers(playerIds, payload) {
    return NotificationController.createBatch(playerIds, payload);
  },

  /** Single facilitator (educator / moderator) */
  async notifyFacilitator(facilitatorId, payload) {
    return NotificationController.create(facilitatorId, payload);
  },

  /** All admins in the system */
  async notifyAdmin(payload) {
    const db = require('../model');
    const admins = await db.User.findAll({
      where: { role: 'admin', account_status: 'active' },
      attributes: ['id']
    });
    const adminIds = admins.map(a => a.id);
    if (adminIds.length === 0) return;
    return NotificationController.createBatch(adminIds, payload);
  },

  /**
   * All enrolled students in a classroom.
   * Used by announcement hooks and module publish hooks.
   */
  async notifyClassroom(classroomId, payload) {
    const db = require('../model');
    const members = await db.ClassroomMember.findAll({
      where: { classroom_id: classroomId },
      attributes: ['user_id']
    });
    const studentIds = members.map(m => m.user_id);
    if (studentIds.length === 0) return;
    return NotificationController.createBatch(studentIds, payload);
  }

};

module.exports = RoleDispatcher;