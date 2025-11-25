const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate, requireAdmin, optionalAuthenticate } = require('../middleware/auth');

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/:id/comments', optionalAuthenticate, postController.addComment);

// Protected routes (Authenticated users)
router.post('/:id/like', authenticate, postController.likePost);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, postController.createPost);
router.put('/:id', authenticate, requireAdmin, postController.updatePost);
router.delete('/:id', authenticate, requireAdmin, postController.deletePost);

module.exports = router;
