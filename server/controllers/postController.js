const Post = require('../models/Post');
const Category = require('../models/Category');

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

    const total = await Post.countDocuments(query);

    res.json({
      posts,
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

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new post (Admin only)
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, image } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const post = new Post({
      title,
      content,
      excerpt,
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
    res.status(500).json({ error: error.message });
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

// Add comment to post (embedded in Post model)
exports.addComment = async (req, res) => {
  try {
    const { authorName, text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      authorName,
      text
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
