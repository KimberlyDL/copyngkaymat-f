// backend/src/controller/NotificationController.js
const { Op } = require('sequelize');
const SSEManager = require('../utils/SSEManager');

// Lazy-load db to avoid circular require (model/index.js → hooks → controller → model)
let _db = null;
const getDb = () => {
  if (!_db) _db = require('../model');
  return _db;
};

const NotificationController = {

  // ─── HTTP route handlers ──────────────────────────────────────────────────

  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 50, offset = 0, unread_only = false } = req.query;

      const whereClause = { user_id: userId };
      if (unread_only === 'true') whereClause.is_read = false;

      const notifications = await getDb().Notification.findAndCountAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const unreadCount = await getDb().Notification.count({
        where: { user_id: userId, is_read: false }
      });

      res.json({
        success: true,
        notifications: notifications.rows,
        total: notifications.count,
        unreadCount,
        hasMore: notifications.count > parseInt(offset) + parseInt(limit)
      });
    } catch (error) {
      console.error('[NotificationController] getNotifications error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  },

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await getDb().Notification.count({
        where: { user_id: userId, is_read: false }
      });
      res.json({ success: true, count });
    } catch (error) {
      console.error('[NotificationController] getUnreadCount error:', error);
      res.status(500).json({ success: false, message: 'Failed to get count' });
    }
  },

  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      const notification = await getDb().Notification.findOne({
        where: { id: notificationId, user_id: userId }
      });
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      await notification.update({ is_read: true, read_at: new Date() });
      res.json({ success: true, notification });
    } catch (error) {
      console.error('[NotificationController] markAsRead error:', error);
      res.status(500).json({ success: false, message: 'Failed to mark as read' });
    }
  },

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await getDb().Notification.update(
        { is_read: true, read_at: new Date() },
        { where: { user_id: userId, is_read: false } }
      );
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      console.error('[NotificationController] markAllAsRead error:', error);
      res.status(500).json({ success: false, message: 'Failed to mark all as read' });
    }
  },

  async deleteNotification(req, res) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      const deleted = await getDb().Notification.destroy({
        where: { id: notificationId, user_id: userId }
      });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
      console.error('[NotificationController] deleteNotification error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
  },

  async clearAll(req, res) {
    try {
      const userId = req.user.id;
      await getDb().Notification.destroy({ where: { user_id: userId } });
      res.json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
      console.error('[NotificationController] clearAll error:', error);
      res.status(500).json({ success: false, message: 'Failed to clear notifications' });
    }
  },

  // ─── Internal helpers (RoleDispatcher / NotificationHooks) ───────────────

  /**
   * Create one notification + fire SSE + Web Push.
   */
  async create(userId, { type = 'system', title, message, icon = 'bell', action_url = null, metadata = {} } = {}) {
    try {
      const notification = await getDb().Notification.create({
        user_id: userId,
        type,
        title,
        message,
        icon,
        action_url,
        metadata
      });

      SSEManager.send(userId, { type: 'notification', data: notification });
      await NotificationController._sendWebPush(userId, { title, message, icon, action_url });

      return notification;
    } catch (error) {
      console.error('[NotificationController] create error:', error);
      return null;
    }
  },

  /**
   * Create notifications for many users at once.
   * SSE + Web Push fired concurrently via setImmediate (never blocks caller).
   */
  async createBatch(userIds, { type = 'system', title, message, icon = 'bell', action_url = null, metadata = {} } = {}) {
    try {
      if (!userIds || userIds.length === 0) return null;

      const rows = userIds.map(userId => ({
        user_id: userId,
        type,
        title,
        message,
        icon,
        action_url,
        metadata
      }));

      const created = await getDb().Notification.bulkCreate(rows);

      setImmediate(async () => {
        const pushPayload = { title, message, icon, action_url };
        await Promise.allSettled(
          userIds.map(async (userId) => {
            SSEManager.send(userId, { type: 'notification', data: { user_id: userId, ...pushPayload } });
            await NotificationController._sendWebPush(userId, pushPayload);
          })
        );
      });

      return created;
    } catch (error) {
      console.error('[NotificationController] createBatch error:', error);
      return null;
    }
  },

  /**
   * Send Web Push to all active subscriptions for a user.
   * BUG FIX: was referencing bare `db` variable which doesn't exist in this
   * file — must use getDb() instead.
   */
  async _sendWebPush(userId, { title, message, icon, action_url }) {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;

    // FIX: use getDb() not the undefined `db` variable
    if (!getDb().PushSubscription) return;

    try {
      const webpush = require('web-push');
      webpush.setVapidDetails(
        process.env.VAPID_EMAIL,
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );

      const subs = await getDb().PushSubscription.findAll({ where: { user_id: userId } });
      await Promise.allSettled(
        subs.map(async (sub) => {
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              JSON.stringify({ title, message, icon, action_url })
            );
          } catch (e) {
            if (e.statusCode === 410) {
              await sub.destroy().catch(() => {});
            }
          }
        })
      );
    } catch (err) {
      console.error('[NotificationController] _sendWebPush error:', err.message);
    }
  }
};

module.exports = NotificationController;