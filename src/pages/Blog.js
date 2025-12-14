import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, Search, Filter, Plus, Heart, MessageCircle, Share } from 'lucide-react';
import api from '../config/api';

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [user, setUser] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'Tümü' }]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory]);

  // Handle like/unlike post
  const handleLike = async (postId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await api.post(`/posts/${postId}/like`);
      const newLikedPosts = new Set(likedPosts);
      
      if (response.data.isLiked) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      
      setLikedPosts(newLikedPosts);
      
      // Update the likes count in the post
      setBlogPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: response.data.likes }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Beğeni işlemi sırasında bir hata oluştu.');
      }
    }
  };

  // Copy post URL to clipboard
  const handleShare = async (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(postUrl);
        setCopiedPostId(postId);
        // Show success message
        alert('✅ Başarıyla kopyalandı!');
        setTimeout(() => {
          setCopiedPostId(null);
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
            setCopiedPostId(postId);
            // Show success message
            alert('✅ Başarıyla kopyalandı!');
            setTimeout(() => {
              setCopiedPostId(null);
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const cats = [{ id: 'all', name: 'Tümü' }, ...response.data.map(cat => ({
        id: cat._id || cat.slug,
        name: cat.name
      }))];
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: postsPerPage,
        sortBy: 'createdAt',
        order: 'desc'
      };
      
      if (selectedCategory !== 'all') {
        params.categoryId = selectedCategory;
      }

      const response = await api.get('/posts', { params });
      const posts = response.data.posts || response.data || [];
      
      // Get current user to check liked posts
      const userData = localStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      const newLikedPosts = new Set();
      
      // Transform backend data to frontend format
      const transformedPosts = posts.map(post => {
        const isAdminAuthor = post.author?.role === 'admin' || post.author?.email === 'admin@penlink.com';
        const isLiked = currentUser && post.likes && post.likes.some(likeId => 
          likeId.toString() === (currentUser.id || currentUser._id).toString()
        );
        
        // Add to liked posts set if user liked it
        if (isLiked) {
          newLikedPosts.add(post._id);
        }
        
        return {
          id: post._id,
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
          author: post.author?.username || 'Bilinmeyen',
          authorAvatar: isAdminAuthor ? '/Attached_image.png' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        date: new Date(post.createdAt).toLocaleDateString('tr-TR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        category: post.category?._id || post.category,
        categoryName: post.category?.name || 'Genel',
        tags: post.tags || [],
        likes: post.likesCount || post.likes?.length || 0,
        comments: post.commentCount || 0,
        readTime: calculateReadTime(post.content),
        image: post.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'
        };
      });
      
      // Update liked posts set
      setLikedPosts(newLikedPosts);
      
      setBlogPosts(transformedPosts);
      setTotalPages(response.data.totalPages || 1);
      
      // Extract all unique tags from posts for popular tags
      const allTags = transformedPosts.flatMap(post => post.tags || []);
      const uniqueTags = [...new Set(allTags.map(tag => tag.trim()))].filter(tag => tag);
      // Get most common tags (limit to 6)
      const tagCounts = {};
      allTags.forEach(tag => {
        const normalizedTag = tag.trim();
        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
      });
      const sortedTags = Object.keys(tagCounts)
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .slice(0, 6);
      setPopularTags(sortedTags.length > 0 ? sortedTags : ['React', 'JavaScript', 'UI/UX', 'AI', 'Startup', 'Design']);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts by search term and tag (client-side filtering)
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tag if selected (case-insensitive, trim whitespace)
    const matchesTag = selectedTag 
      ? post.tags && post.tags.some(tag => 
          tag && tag.trim().toLowerCase() === selectedTag.trim().toLowerCase()
        )
      : true;
    
    return matchesSearch && matchesTag;
  });

  // Pagination logic - posts already paginated from API
  const currentPosts = filteredPosts;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              PenLink Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teknoloji, tasarım ve geliştirme dünyasından en güncel içerikler
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tümü
                </button>
                {categories.filter(cat => cat.id !== 'all').map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popüler Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.length > 0 ? (
                  popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTag && selectedTag.toLowerCase() === tag.toLowerCase()) {
                          setSelectedTag(null); // Deselect if already selected
                        } else {
                          setSelectedTag(tag);
                          setCurrentPage(1); // Reset to first page
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                        selectedTag && selectedTag.toLowerCase() === tag.toLowerCase()
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Henüz etiket bulunmamaktadır.</p>
                )}
              </div>
              {selectedTag && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setCurrentPage(1);
                  }}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Filtreyi Temizle
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Blog yazılarında ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {user ? (
                  <Link
                    to="/post/new"
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Post
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed flex items-center opacity-60"
                    title="Yeni post oluşturmak için giriş yapmalısınız"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Post (Giriş Gerekli)
                  </button>
                )}
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600">Yazılar yükleniyor...</p>
                </div>
              ) : currentPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Henüz yazı bulunmamaktadır.</p>
                </div>
              ) : (
                currentPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="md:flex">
                    <Link to={`/post/${post.id}`} className="md:w-1/3 cursor-pointer">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center mb-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 ml-4">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </div>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                        <Link to={`/post/${post.id}`} className="cursor-pointer">{post.title}</Link>
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleShare(post.id)}
                            className={`p-2 transition-colors ${
                              copiedPostId === post.id
                                ? 'text-green-600 bg-green-50' 
                                : 'text-gray-400 hover:text-primary-600'
                            }`}
                            title="Post URL'sini kopyala"
                          >
                            <Share className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleLike(post.id)}
                            disabled={!user}
                            className={`p-2 transition-colors ${
                              !user
                                ? 'text-gray-300 cursor-not-allowed opacity-50'
                                : likedPosts.has(post.id)
                                  ? 'text-red-500 hover:text-red-600'
                                  : 'text-gray-400 hover:text-red-500'
                            }`}
                            title={!user ? 'Beğenmek için giriş yapmalısınız' : likedPosts.has(post.id) ? 'Beğeniyi kaldır' : 'Beğen'}
                          >
                            <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 border rounded-lg transition-colors ${
                      currentPage === 1 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Önceki
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 border rounded-lg transition-colors ${
                      currentPage === totalPages 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
