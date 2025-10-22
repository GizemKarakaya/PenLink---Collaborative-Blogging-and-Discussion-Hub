import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Search, Filter, Plus, Heart, MessageCircle, Share } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'technology', name: 'Teknoloji' },
    { id: 'design', name: 'Tasarım' },
    { id: 'development', name: 'Geliştirme' },
    { id: 'business', name: 'İş Dünyası' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Modern Web Geliştirmede En İyi Pratikler',
      excerpt: '2024 yılında web geliştirme dünyasında dikkat edilmesi gereken önemli noktalar ve en iyi pratikler.',
      author: 'Ahmet Yılmaz',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      date: '15 Mart 2024',
      category: 'development',
      tags: ['React', 'JavaScript', 'Web Development'],
      likes: 24,
      comments: 8,
      readTime: '5 dk',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'UI/UX Tasarımda Kullanıcı Deneyimi',
      excerpt: 'Kullanıcı deneyimini ön planda tutarak etkili arayüz tasarımları nasıl oluşturulur?',
      author: 'Elif Kaya',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      date: '12 Mart 2024',
      category: 'design',
      tags: ['UI/UX', 'Design', 'User Experience'],
      likes: 18,
      comments: 12,
      readTime: '7 dk',
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Yapay Zeka ve Geleceğin Teknolojileri',
      excerpt: 'Yapay zeka teknolojilerinin gelecekteki etkileri ve yazılım geliştirme süreçlerine katkıları.',
      author: 'Mehmet Demir',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      date: '10 Mart 2024',
      category: 'technology',
      tags: ['AI', 'Machine Learning', 'Future Tech'],
      likes: 31,
      comments: 15,
      readTime: '8 dk',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'Startup Dünyasında Başarı Hikayeleri',
      excerpt: 'Başarılı startup girişimlerinin ortak özellikleri ve başarıya giden yolda dikkat edilmesi gerekenler.',
      author: 'Zeynep Özkan',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      date: '8 Mart 2024',
      category: 'business',
      tags: ['Startup', 'Entrepreneurship', 'Success'],
      likes: 22,
      comments: 6,
      readTime: '6 dk',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      title: 'Node.js ile Backend Geliştirme',
      excerpt: 'Node.js kullanarak modern backend uygulamaları geliştirme teknikleri ve en iyi pratikler.',
      author: 'Mehmet Demir',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      date: '6 Mart 2024',
      category: 'development',
      tags: ['Node.js', 'Backend', 'JavaScript'],
      likes: 15,
      comments: 9,
      readTime: '7 dk',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      title: 'Vue.js vs React Karşılaştırması',
      excerpt: 'İki popüler frontend framework arasındaki farklar ve hangi durumda hangisini seçmeli.',
      author: 'Ahmet Yılmaz',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      date: '4 Mart 2024',
      category: 'technology',
      tags: ['Vue.js', 'React', 'Frontend'],
      likes: 28,
      comments: 14,
      readTime: '8 dk',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      id: 7,
      title: 'Mobil Uygulama Tasarım Prensipleri',
      excerpt: 'Kullanıcı dostu mobil uygulamalar tasarlarken dikkat edilmesi gereken temel prensipler.',
      author: 'Elif Kaya',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      date: '2 Mart 2024',
      category: 'design',
      tags: ['Mobile', 'UI/UX', 'Design'],
      likes: 19,
      comments: 7,
      readTime: '6 dk',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

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
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
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
                {['React', 'JavaScript', 'UI/UX', 'AI', 'Startup', 'Design'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
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
                <button className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Yeni Yazı (Giriş Gerekli)
                </button>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
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
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
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
                          <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                            <Share className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
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
              ))}
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
