const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');
const Comment = require('../models/Comment');
const ContactMessage = require('../models/ContactMessage');

// Get posts per category statistics
exports.getPostsPerCategory = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $project: {
          categoryName: '$categoryInfo.name',
          categoryId: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard statistics (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalContactMessages = await ContactMessage.countDocuments();

    res.json({
      totalPosts,
      totalCategories,
      totalUsers,
      totalComments,
      totalContactMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

