import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Search, Trash2, Eye, Calendar, User, MessageSquare } from 'lucide-react';
import api from '../config/api';

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact');
      const transformedMessages = response.data.map(msg => ({
        id: msg._id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        date: new Date(msg.submissionDate || msg.createdAt).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        rawDate: msg.submissionDate || msg.createdAt
      }));
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Mesajlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const message = messages.find(m => m.id === id);
    const messageName = message ? message.name : 'bu mesaj';
    
    if (window.confirm(`"${messageName}" adlı kullanıcının mesajını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`)) {
      try {
        await api.delete(`/contact/${id}`);
        fetchMessages(); // Refresh list
      } catch (error) {
        console.error('Error deleting message:', error);
        console.error('Error response:', error.response);
        const errorMessage = error.response?.data?.error || error.message || 'Mesaj silinirken bir hata oluştu.';
        alert(`Hata: ${errorMessage}`);
      }
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by date (newest first)
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    return new Date(b.rawDate) - new Date(a.rawDate);
  });

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
                <h1 className="text-2xl font-bold text-gray-900">İletişim Mesajları</h1>
                <p className="text-gray-600">Gelen iletişim mesajlarını yönetin</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {messages.length} mesaj
              </span>
            </div>
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
              placeholder="Mesajlarda ara (isim, email, mesaj içeriği)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Mesajlar yükleniyor...</p>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz mesaj bulunmamaktadır.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                        <p className="text-sm text-gray-500">{message.email}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{message.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                      className="text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Detayları göster/gizle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {selectedMessage === message.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">İsim:</span>
                        <p className="text-gray-900">{message.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">E-posta:</span>
                        <p className="text-gray-900">
                          <a href={`mailto:${message.email}`} className="text-primary-600 hover:underline">
                            {message.email}
                          </a>
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Mesaj:</span>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Gönderim Tarihi:</span>
                        <p className="text-gray-900">{message.date}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;

