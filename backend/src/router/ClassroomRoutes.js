const express = require('express');
const router = express.Router();
const classroomController = require('../controller/ClassroomController');
const { authenticate, requireRole } = require('../middleware/AuthMiddleware');

// Lahat ng routes dito kailangan ng login
router.use(authenticate);

/**
 * 1. Specific Static Routes
 */
router.get('/my-classrooms', classroomController.getMyClassrooms);
router.post('/create', requireRole(['educator', 'moderator', 'admin']), classroomController.createClassroom);
router.post('/join', requireRole('player'), classroomController.joinClassroom);

/**
 * 2. Feature-Specific Dynamic Routes
 */
router.get('/:id/progress', requireRole(['educator', 'moderator', 'admin']), classroomController.getClassroomProgress);

// Classroom Announcements Routes
router.post('/:id/announcements', requireRole(['educator', 'moderator', 'admin']), classroomController.createClassroomAnnouncement);
router.get('/:id/announcements', classroomController.getClassroomAnnouncements);
router.put('/:id/announcements/:announcementId', requireRole(['educator', 'moderator', 'admin']), classroomController.updateClassroomAnnouncement);
router.delete('/:id/announcements/:announcementId', requireRole(['educator', 'moderator', 'admin']), classroomController.deleteClassroomAnnouncement);

/**
 * 3. General Dynamic Parameter Routes (Dapat laging huli)
 */
router.get('/:id', classroomController.getClassroomDetails);
router.put('/:id', requireRole(['educator', 'moderator', 'admin']), classroomController.updateClassroom);
router.delete('/:id', requireRole(['educator', 'moderator', 'admin']), classroomController.deleteClassroom);

module.exports = router;