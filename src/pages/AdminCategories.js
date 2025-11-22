import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Search, Folder } from 'lucide-react';

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: 1,
      name: 'Teknoloji',
      description: 'Teknoloji ile ilgili yazılar',
      postCount: 8,
      slug: 'technology'
    },
    {
      id: 2,
      name: 'Tasarım',
      description: 'UI/UX ve tasarım konuları',
      postCount: 5,
      slug: 'design'
    },
    {
      id: 3,
      name: 'Geliştirme',
      description: 'Yazılım geliştirme ve programlama',
      postCount: 7,
      slug: 'development'
    },
    {
      id: 4,
      name: 'İş Dünyası',
      description: 'İş ve girişimcilik konuları',
      postCount: 4,
      slug: 'business'
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/admin"
                className="mr-4 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
                <p className="text-gray-600">Blog kategorilerini yönetin</p>
              </div>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Yeni Kategori
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kategorilerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Folder className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">{category.postCount}</span>
                  <span className="ml-1">yazı</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Görüntüle
                  </Link>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">Kategori bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
