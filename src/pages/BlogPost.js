import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Tag, Heart, MessageCircle, Share, Bookmark, ArrowLeft, Edit, Trash2 } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Ali Veli',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: 'Çok faydalı bir yazı olmuş, teşekkürler!',
      date: '2 gün önce',
      likes: 3
    },
    {
      id: 2,
      author: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      content: 'Bu konuda daha detaylı bilgi verebilir misiniz?',
      date: '1 gün önce',
      likes: 1
    }
  ]);

  // Mock blog post data
  const blogPost = {
    id: 1,
    title: 'Modern Web Geliştirmede En İyi Pratikler',
    content: `
      <p>Web geliştirme dünyası sürekli olarak değişiyor ve gelişiyor. 2024 yılında dikkat edilmesi gereken en önemli noktaları sizlerle paylaşmak istiyorum.</p>
      
      <h2>1. Responsive Tasarım</h2>
      <p>Mobil cihazların kullanımının artmasıyla birlikte, responsive tasarım artık bir lüks değil, zorunluluk haline geldi. CSS Grid ve Flexbox gibi modern CSS özelliklerini kullanarak esnek ve uyumlu tasarımlar oluşturabilirsiniz.</p>
      
      <h2>2. Performans Optimizasyonu</h2>
      <p>Kullanıcı deneyimini doğrudan etkileyen performans, web sitelerinin başarısında kritik rol oynar. Lazy loading, image optimization ve code splitting gibi tekniklerle sitenizin hızını artırabilirsiniz.</p>
      
      <h2>3. SEO ve Erişilebilirlik</h2>
      <p>Semantic HTML kullanımı, proper heading hierarchy ve alt text'ler gibi temel SEO ve erişilebilirlik prensiplerini uygulamak, sitenizin hem arama motorlarında hem de kullanıcılar arasında daha iyi performans göstermesini sağlar.</p>
      
      <h2>4. Güvenlik</h2>
      <p>Web güvenliği konusunda HTTPS kullanımı, input validation ve XSS koruması gibi temel güvenlik önlemlerini almak artık standart haline geldi.</p>
      
      <p>Bu pratikleri uygulayarak daha kaliteli ve kullanıcı dostu web uygulamaları geliştirebilirsiniz.</p>
    `,
    author: 'Ahmet Yılmaz',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    date: '15 Mart 2024',
    readTime: '5 dk',
    likes: 24,
    comments: 8,
    tags: ['React', 'JavaScript', 'Web Development'],
    category: 'development',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Yorum sistemi şimdilik devre dışı
    alert('Yorum yapmak için giriş yapmanız gerekiyor.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Blog'a Dön
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
                  className={`p-2 rounded-lg transition-colors ${
                    isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked ? 'text-primary-500 bg-primary-50' : 'text-gray-400 hover:text-primary-500'
                  }`}
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{blogPost.likes + (isLiked ? 1 : 0)}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{blogPost.comments}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share className="w-5 h-5" />
                  <span>Paylaş</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Yorumlar ({comments.length})
          </h3>

          {/* Comment Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
            <p className="text-gray-600 mb-4">Yorum yapmak için giriş yapmanız gerekiyor.</p>
            <button
              onClick={handleCommentSubmit}
              className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed"
              disabled
            >
              Yorum Yap (Giriş Gerekli)
            </button>
          </div>

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
