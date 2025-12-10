const Post = require('../models/Post');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

// Get all posts with filtering and sorting
exports.getAllPosts = async (req, res) => {
  try {
    const { categoryId, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (categoryId) {
      query.category = categoryId;
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const posts = await Post.find(query)
      .populate('author', 'username email')
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get comment counts for each post
    const postIds = posts.map(post => post._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } }
    ]);

    // Create a map of post ID to comment count
    const commentCountMap = {};
    commentCounts.forEach(item => {
      commentCountMap[item._id.toString()] = item.count;
    });

    // Add comment count to each post
    const postsWithComments = posts.map(post => {
      const postObj = post.toObject();
      postObj.commentCount = commentCountMap[post._id.toString()] || 0;
      postObj.likesCount = post.likes ? post.likes.length : 0;
      return postObj;
    });

    const total = await Post.countDocuments(query);

    res.json({
      posts: postsWithComments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email')
      .populate('category', 'name slug');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get comment count for this post
    const commentCount = await Comment.countDocuments({ post: post._id });
    
    // Add comment count and likes count to post
    const postObj = post.toObject();
    postObj.commentCount = commentCount;
    postObj.likesCount = post.likes ? post.likes.length : 0;

    res.json(postObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new post (Authenticated users)
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, image } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Başlık gereklidir' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'İçerik gereklidir' });
    }

    if (!category) {
      return res.status(400).json({ error: 'Kategori seçilmelidir' });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Seçilen kategori bulunamadı' });
    }

    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt ? excerpt.trim() : '',
      author: req.user._id,
      category,
      tags: tags || [],
      image: image || null
    });

    await post.save();
    await post.populate('author', 'username email');
    await post.populate('category', 'name slug');

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    // More specific error messages
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ error: `Doğrulama hatası: ${errors}` });
    }
    res.status(500).json({ error: error.message || 'Yazı oluşturulurken bir hata oluştu' });
  }
};

// Update post (Admin only)
exports.updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, image } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ error: 'Category not found' });
      }
      post.category = category;
    }
    if (tags) post.tags = tags;
    if (image !== undefined) post.image = image;

    await post.save();
    await post.populate('author', 'username email');
    await post.populate('category', 'name slug');

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete post (Admin only)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like/Unlike post
exports.likePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add comment to post (using separate Comment collection for composite relationship)
exports.addComment = async (req, res) => {
  try {
    const { authorName, text } = req.body;
    const postId = req.params.id;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create comment in separate collection (composite relationship)
    const comment = new Comment({
      post: postId,
      author: req.user ? req.user._id : null,
      authorName: authorName || (req.user ? req.user.username : 'Anonymous'),
      text
    });

    await comment.save();
    await comment.populate('author', 'username email');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
