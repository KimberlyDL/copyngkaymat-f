const express = require('express');
const router = express.Router();
const moduleController = require('../controller/ModuleController');
const { authenticate, requireRole } = require('../middleware/AuthMiddleware');
const { upload } = require('../middleware/FileUploadMiddleware');

const canManageModules = requireRole(['educator', 'moderator', 'admin']);

// ==========================================
// Public & Shared Routes
// ==========================================
router.get('/featured', moduleController.getStats);
router.get('/stats', moduleController.getStats);

// ==========================================
// Protected Routes (Facilitator/Admin Only)
// ==========================================

// 🔴 MUST come before '/:id' — otherwise Express matches 'my-modules' as an :id param
router.get('/facilitator/my-modules', authenticate, canManageModules, moduleController.getFacilitatorModules);

// 🟢 New engagement endpoint for ModuleStats.vue
router.get('/:id/engagement', authenticate,  canManageModules, moduleController.getModuleEngagement);
router.post('/:id/file', authenticate, canManageModules,
    upload.single('module_file'),
    moduleController.uploadModuleFile
);

router.post('/:id/thumbnail', authenticate, canManageModules,
    upload.single('thumbnail'),
    moduleController.uploadModuleThumbnail
);
// ==========================================
// General Module Routes
// ==========================================
router.get('/', authenticate, moduleController.getModules);
router.get('/:id', authenticate, moduleController.getModuleById);

router.post(
    '/',
    authenticate,
    canManageModules,
    upload.fields([
        { name: 'module_file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    moduleController.createModuleWithFiles
);

router.put('/:id', authenticate, canManageModules, moduleController.updateModule);
router.delete('/:id', authenticate, canManageModules, moduleController.deleteModule);
router.patch('/:id/publish', authenticate, canManageModules, moduleController.togglePublish);

module.exports = router;