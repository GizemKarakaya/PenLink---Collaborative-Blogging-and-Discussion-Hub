import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Search, Folder } from 'lucide-react';
import api from '../config/api';

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDescription, setEditCategoryDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') {
      alert('Kategori adı gereklidir.');
      return;
    }
    try {
      await api.post('/categories', {
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim()
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      const errorMessage = error.response?.data?.error || 'Kategori eklenirken bir hata oluştu.';
      alert(errorMessage);
    }
  };

  const handleEditClick = (category) => {
    setEditCategoryId(category._id);
    setEditCategoryName(category.name);
    setEditCategoryDescription(category.description || '');
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (editCategoryName.trim() === '') {
      alert('Kategori adı gereklidir.');
      return;
    }
    try {
      await api.put(`/categories/${editCategoryId}`, {
        name: editCategoryName.trim(),
        description: editCategoryDescription.trim()
      });
      setEditCategoryId(null);
      setEditCategoryName('');
      setEditCategoryDescription('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      const errorMessage = error.response?.data?.error || 'Kategori güncellenirken bir hata oluştu.';
      alert(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName('');
    setEditCategoryDescription('');
  };

  const handleDeleteCategory = async (id) => {
    const category = categories.find(c => c._id === id);
    const categoryName = category ? category.name : 'bu kategori';
    
    if (window.confirm(`"${categoryName}" kategorisini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`)) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        const errorMessage = error.response?.data?.error || 'Kategori silinirken bir hata oluştu.';
        alert(errorMessage);
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Kategori
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Category Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kategori Ekle</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  id="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Kategori adını girin"
                  required
                />
              </div>
              <div>
                <label htmlFor="newCategoryDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  id="newCategoryDescription"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Kategori açıklamasını girin"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategoryName('');
                    setNewCategoryDescription('');
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

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
            <div key={category._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              {editCategoryId === category._id ? (
                // Edit Form
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Adı *
                    </label>
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={editCategoryDescription}
                      onChange={(e) => setEditCategoryDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              ) : (
                // Category Display
                <>
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
                  
                  <p className="text-gray-600 mb-4 text-sm">{category.description || 'Açıklama yok'}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">{category.postCount || 0}</span>
                      <span className="ml-1">yazı</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/category/${category.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                        title="Görüntüle"
                      >
                        Görüntüle
                      </Link>
                      <button 
                        onClick={() => handleEditClick(category)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-700"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
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
