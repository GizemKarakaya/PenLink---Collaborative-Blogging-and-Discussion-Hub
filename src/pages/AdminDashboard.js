import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Folder, Users, MessageCircle, TrendingUp, Settings, Mail } from 'lucide-react';
import api from '../config/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Toplam Yazı', value: '0', icon: BookOpen, color: 'bg-blue-100 text-blue-600', link: '/admin/posts' },
    { label: 'Kategoriler', value: '0', icon: Folder, color: 'bg-green-100 text-green-600', link: '/admin/categories' },
    { label: 'Kullanıcılar', value: '0', icon: Users, color: 'bg-purple-100 text-purple-600', link: '#' },
    { label: 'Yorumlar', value: '0', icon: MessageCircle, color: 'bg-orange-100 text-orange-600', link: '#' },
    { label: 'İletişim Mesajları', value: '0', icon: Mail, color: 'bg-pink-100 text-pink-600', link: '/admin/messages' }
  ]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, postsResponse] = await Promise.all([
        api.get('/statistics/dashboard'),
        api.get('/posts', { params: { limit: 3, sortBy: 'createdAt', order: 'desc' } })
      ]);

      const dashboardStats = statsResponse.data;
      setStats([
        { label: 'Toplam Yazı', value: dashboardStats.totalPosts?.toString() || '0', icon: BookOpen, color: 'bg-blue-100 text-blue-600', link: '/admin/posts' },
        { label: 'Kategoriler', value: dashboardStats.totalCategories?.toString() || '0', icon: Folder, color: 'bg-green-100 text-green-600', link: '/admin/categories' },
        { label: 'Kullanıcılar', value: dashboardStats.totalUsers?.toString() || '0', icon: Users, color: 'bg-purple-100 text-purple-600', link: '#' },
        { label: 'Yorumlar', value: dashboardStats.totalComments?.toString() || '0', icon: MessageCircle, color: 'bg-orange-100 text-orange-600', link: '#' },
        { label: 'İletişim Mesajları', value: dashboardStats.totalContactMessages?.toString() || '0', icon: Mail, color: 'bg-pink-100 text-pink-600', link: '/admin/messages' }
      ]);

      const posts = postsResponse.data.posts || postsResponse.data || [];
      const transformedPosts = posts.map(post => ({
        id: post._id,
        title: post.title,
        date: new Date(post.createdAt).toLocaleDateString('tr-TR'),
        views: 0
      }));
      setRecentPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
              <p className="text-gray-600">Yönetim ve istatistikler</p>
            </div>
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Siteye Dön
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Son Yazılar</h2>
              <Link
                to="/admin/posts"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Tümünü Gör
              </Link>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{post.date}</span>
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {post.views} görüntülenme
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="space-y-3">
              <Link
                to="/admin/posts"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-3 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Yazı Yönetimi</p>
                  <p className="text-sm text-gray-600">Yazıları görüntüle, düzenle veya sil</p>
                </div>
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Folder className="w-5 h-5 mr-3 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Kategori Yönetimi</p>
                  <p className="text-sm text-gray-600">Kategorileri yönet</p>
                </div>
              </Link>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Ayarlar</p>
                  <p className="text-sm text-gray-600">Yakında...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
