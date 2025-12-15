import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, Heart, MessageCircle, Share, Bookmark, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import api from '../config/api';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [blogPost, setBlogPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  // Calculate reading time based on content
  const calculateReadTime = (content) => {
    if (!content) return '1 dk';
    
    // Remove HTML tags and get plain text
    const text = content.replace(/<[^>]*>/g, '').trim();
    
    // Count words (split by whitespace)
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    // Average reading speed: 200 words per minute
    const readingSpeed = 200;
    const minutes = Math.max(1, Math.ceil(wordCount / readingSpeed));
    
    return `${minutes} dk`;
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      const post = response.data;
      
      setLikesCount(post.likes?.length || 0);
      
      // Check if user liked this post (after user is loaded)
      const userData = localStorage.getItem('user');
      if (userData && post.likes) {
        const currentUser = JSON.parse(userData);
        const userId = currentUser.id || currentUser._id;
        setIsLiked(post.likes.some(likeId => likeId.toString() === userId.toString()));
      }
      
      const isAdminAuthor = post.author?.role === 'admin' || post.author?.email === 'admin@penlink.com';
      setBlogPost({
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author?.username || 'Bilinmeyen',
        authorAvatar: isAdminAuthor ? '/Attached_image.png' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        date: new Date(post.createdAt).toLocaleDateString('tr-TR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        readTime: calculateReadTime(post.content),
        tags: post.tags || [],
        category: post.category?.name || '',
        image: post.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
      });
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${id}`);
      const transformedComments = response.data.map(comment => {
        const isAdminComment = comment.author?.role === 'admin' || comment.author?.email === 'admin@penlink.com' || comment.authorName === 'admin';
        return {
          id: comment._id,
          author: comment.authorName || comment.author?.username || 'Bilinmeyen',
          avatar: isAdminComment ? '/Attached_image.png' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          content: comment.text,
          date: new Date(comment.submissionDate || comment.createdAt).toLocaleDateString('tr-TR'),
          likes: comment.likes?.length || 0
        };
      });
      setComments(transformedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await api.post(`/posts/${id}/like`);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark API endpoint
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(postUrl);
        setShareCopied(true);
        // Show success message
        alert('✅ Başarıyla kopyalandı!');
        setTimeout(() => {
          setShareCopied(false);
        }, 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = postUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setShareCopied(true);
            // Show success message
            alert('✅ Başarıyla kopyalandı!');
            setTimeout(() => {
              setShareCopied(false);
            }, 2000);
          } else {
            alert('❌ URL kopyalanamadı. Lütfen manuel olarak kopyalayın: ' + postUrl);
          }
        } catch (e) {
          alert('❌ URL kopyalanamadı. Lütfen manuel olarak kopyalayın: ' + postUrl);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      alert('❌ URL kopyalanamadı. Lütfen manuel olarak kopyalayın: ' + postUrl);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (newComment.trim()) {
      try {
        await api.post(`/posts/${id}/comments`, {
          authorName: user.name || user.username,
          text: newComment
        });
        setNewComment('');
        fetchComments(); // Refresh comments
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Yazı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Yazı bulunamadı.</p>
          <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Hero Image */}
          <div className="aspect-video">
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            {/* Post Meta */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={blogPost.authorAvatar}
                  alt={blogPost.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center text-gray-900 font-medium">
                    <User className="w-4 h-4 mr-2" />
                    {blogPost.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {blogPost.date} • {blogPost.readTime} okuma
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  disabled={!user}
                  className={`p-2 rounded-lg transition-colors ${
                    !user 
                      ? 'text-gray-300 cursor-not-allowed opacity-50' 
                      : isLiked 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500'
                  }`}
                  title={!user ? 'Beğenmek için giriş yapmalısınız' : ''}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleBookmark}
                  disabled={!user}
                  className={`p-2 rounded-lg transition-colors ${
                    !user 
                      ? 'text-gray-300 cursor-not-allowed opacity-50' 
                      : isBookmarked 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-gray-400 hover:text-primary-500'
                  }`}
                  title={!user ? 'Kaydetmek için giriş yapmalısınız' : ''}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary-500 rounded-lg transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blogPost.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Post Content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Post Actions */}
            <div className="flex items-center justify-between py-6 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  disabled={!user}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    !user 
                      ? 'text-gray-400 cursor-not-allowed opacity-50' 
                      : isLiked 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={!user ? 'Beğenmek için giriş yapmalısınız' : ''}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{comments.length}</span>
                </button>
                <button 
                  onClick={handleShare}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    shareCopied 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Post URL'sini kopyala"
                >
                  <Share className="w-5 h-5" />
                  <span>{shareCopied ? 'Kopyalandı!' : 'Paylaş'}</span>
                </button>
              </div>
              {user && user.role === 'admin' && (
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Yorumlar ({comments.length})
          </h3>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Yorum Yap
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
              <p className="text-gray-600 mb-4">Yorum yapmak için giriş yapmanız gerekiyor.</p>
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block"
              >
                Giriş Yap
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="hover:text-primary-600 transition-colors">
                      Beğen ({comment.likes})
                    </button>
                    <button className="hover:text-primary-600 transition-colors">
                      Yanıtla
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
