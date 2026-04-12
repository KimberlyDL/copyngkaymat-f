// backend/src/router/NotificationRoutes.js
const express = require('express');
const router = express.Router();
const NotificationController = require('../controller/NotificationController');
const SSEManager = require('../utils/SSEManager');
const { Announcement, User } = require('../model');
const { authenticate } = require('../middleware/AuthMiddleware');

// All notification routes require authentication
router.use(authenticate);

// ─── SSE stream ──────────────────────────────────────────────────────────────
// GET /api/v1/notifications/stream
// Must be defined BEFORE the /:id wildcard routes to avoid being swallowed.
//
// The route simply calls SSEManager.connect() and returns — SSEManager owns
// the response object from here on. Do NOT call res.end() or res.json() after
// this. The 'close' event inside SSEManager handles all cleanup automatically.
router.get('/stream', (req, res) => {
  SSEManager.connect(req.user.id, res);
  // ← intentionally no res.json() / res.end() here
});

// ─── Public announcements ────────────────────────────────────────────────────
// GET /api/v1/notifications/announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      where: { type: 'public', status: 'active' },
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'role'] }],
      order: [['priority', 'DESC'], ['created_at', 'DESC']],
      limit: 10
    });
    res.json({ announcements });
  } catch (error) {
    console.error('Failed to fetch public announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
});

// ─── CRUD routes ─────────────────────────────────────────────────────────────
// GET  /api/v1/notifications
router.get('/', NotificationController.getNotifications);

// GET  /api/v1/notifications/unread-count
router.get('/unread-count', NotificationController.getUnreadCount);

// PATCH /api/v1/notifications/read-all
router.patch('/read-all', NotificationController.markAllAsRead);

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', NotificationController.markAsRead);

// DELETE /api/v1/notifications/clear-all
router.delete('/clear-all', NotificationController.clearAll);

// DELETE /api/v1/notifications/:id
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;