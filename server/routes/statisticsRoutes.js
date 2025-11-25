const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public route
router.get('/posts-per-category', statisticsController.getPostsPerCategory);

// Protected route (Admin only)
router.get('/dashboard', authenticate, requireAdmin, statisticsController.getDashboardStats);

module.exports = router;
