import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus, Search, Filter, TrendingUp, Clock, Users, ThumbsUp, Reply } from 'lucide-react';

const Discussion = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'general', name: 'Genel' },
    { id: 'tech', name: 'Teknoloji' },
    { id: 'design', name: 'Tasarım' },
    { id: 'help', name: 'Yardım' },
    { id: 'announcements', name: 'Duyurular' }
  ];

  const discussions = [
    {
      id: 1,
      title: 'React 18\'deki Yeni Özellikler Hakkında',
      content: 'React 18 ile gelen yeni özellikler hakkında ne düşünüyorsunuz? Concurrent features gerçekten performansı artırıyor mu?',
      author: 'Ahmet Yılmaz',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      category: 'tech',
      replies: 12,
      likes: 8,
      views: 156,
      lastActivity: '2 saat önce',
      isPinned: true,
      isTrending: true
    },
    {
      id: 2,
      title: 'UI/UX Tasarımda Renk Seçimi',
      content: 'Projelerinizde renk paleti seçerken hangi kriterleri dikkate alıyorsunuz? Accessibility konusunda önerileriniz var mı?',
      author: 'Elif Kaya',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      category: 'design',
      replies: 7,
      likes: 15,
      views: 89,
      lastActivity: '4 saat önce',
      isPinned: false,
      isTrending: false
    },
    {
      id: 3,
      title: 'Yeni Üyeler İçin Hoş Geldiniz!',
      content: 'PenLink topluluğuna hoş geldiniz! Bu platformda nasıl etkileşim kurabileceğiniz hakkında bilgiler.',
      author: 'Admin',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      category: 'announcements',
      replies: 3,
      likes: 22,
      views: 234,
      lastActivity: '1 gün önce',
      isPinned: true,
      isTrending: false
    },
    {
      id: 4,
      title: 'JavaScript Async/Await Kullanımı',
      content: 'Async/await kullanırken karşılaştığınız yaygın hatalar neler? Best practices önerileriniz var mı?',
      author: 'Mehmet Demir',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      category: 'tech',
      replies: 9,
      likes: 11,
      views: 67,
      lastActivity: '6 saat önce',
      isPinned: false,
      isTrending: true
    },
    {
      id: 5,
      title: 'Figma vs Adobe XD Karşılaştırması',
      content: 'UI tasarımı için hangi aracı tercih ediyorsunuz? Figma ve Adobe XD arasındaki farklar neler?',
      author: 'Zeynep Özkan',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      category: 'design',
      replies: 14,
      likes: 6,
      views: 123,
      lastActivity: '8 saat önce',
      isPinned: false,
      isTrending: false
    }
  ];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedDiscussions = filteredDiscussions.filter(d => d.isPinned);
  const regularDiscussions = filteredDiscussions.filter(d => !d.isPinned);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discussion Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Toplulukla birlikte öğrenin, tartışın ve deneyimlerinizi paylaşın
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Topluluk İstatistikleri</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aktif Üyeler</span>
                  <span className="font-semibold text-gray-900">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Toplam Tartışma</span>
                  <span className="font-semibold text-gray-900">567</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bu Hafta</span>
                  <span className="font-semibold text-gray-900">89</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tartışmalarda ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Yeni Tartışma (Giriş Gerekli)
                </button>
              </div>
            </div>

            {/* Pinned Discussions */}
            {pinnedDiscussions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary-600" />
                  Sabitlenmiş Tartışmalar
                </h2>
                <div className="space-y-4">
                  {pinnedDiscussions.map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} isPinned={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Discussions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                Son Tartışmalar
              </h2>
              <div className="space-y-4">
                {regularDiscussions.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} isPinned={false} />
                ))}
              </div>
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                Daha Fazla Yükle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscussionCard = ({ discussion, isPinned }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
      isPinned ? 'border-l-4 border-primary-500' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {isPinned && (
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium mr-2">
                Sabitlenmiş
              </span>
            )}
            {discussion.isTrending && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium mr-2">
                Trend
              </span>
            )}
            <span className="text-sm text-gray-500 capitalize">
              {discussion.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            <Link to={`/discussion/${discussion.id}`}>{discussion.title}</Link>
          </h3>
          <p className="text-gray-600 line-clamp-2 mb-4">
            {discussion.content}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img
              src={discussion.authorAvatar}
              alt={discussion.author}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">{discussion.author}</div>
              <div className="text-xs text-gray-500">{discussion.lastActivity}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            {discussion.replies}
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {discussion.likes}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {discussion.views}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;
