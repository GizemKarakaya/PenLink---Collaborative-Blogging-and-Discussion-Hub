const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');

// Public routes
router.get('/post/:postId', commentController.getPostComments);

// Routes with optional authentication (comment can be created by anonymous users)
router.post('/post/:postId', optionalAuthenticate, commentController.createComment);

// Protected routes (authenticated users)
router.post('/:id/like', authenticate, commentController.likeComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
