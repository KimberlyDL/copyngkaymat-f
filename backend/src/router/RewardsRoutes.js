const express = require('express');
const router = express.Router();
const rewardsController = require('../controller/RewardsController');
const { authenticate, requireRole } = require('../middleware/AuthMiddleware');

// All routes require authentication
router.use(authenticate);

// ===== Student Routes =====
// Get all available rewards for the shop
router.get('/available', rewardsController.getAvailableRewards);

// Get user's claimed rewards inventory
router.get('/my-inventory', rewardsController.getMyInventory);

// Claim a reward (trade XP)
router.post('/claim/:id', rewardsController.claimReward);

// ===== Admin/Facilitator Routes =====
const canManageRewards = requireRole(['educator', 'moderator', 'admin']);

// Get ALL rewards (including inactive) for management
router.get('/all', canManageRewards, rewardsController.getAllRewardsForAdmin);

// Create a new reward
router.post('/', canManageRewards, rewardsController.createReward);

// Update a reward
router.put('/:id', canManageRewards, rewardsController.updateReward);

// Delete a reward
router.delete('/:id', canManageRewards, rewardsController.deleteReward);

module.exports = router;
