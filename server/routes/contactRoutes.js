const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public route
router.post('/', contactController.submitMessage);

// Protected routes (Admin only)
router.get('/', authenticate, requireAdmin, contactController.getAllMessages);
// DELETE must come before GET /:id to avoid route conflict
router.delete('/:id', authenticate, requireAdmin, contactController.deleteMessage);
router.get('/:id', authenticate, requireAdmin, contactController.getMessageById);

module.exports = router;

