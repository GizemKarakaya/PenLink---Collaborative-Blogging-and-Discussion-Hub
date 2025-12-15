# PenLink Frontend - Detaylı Dokümantasyon

## 📋 Genel Bakış

PenLink frontend'i **React 18.2.0** kullanarak geliştirilmiş, **Tailwind CSS** ile stillendirilmiş, **React Router DOM** ile routing yapılan modern bir Single Page Application (SPA)'dır.

### Teknoloji Stack
- **React 18.2.0**: UI framework
- **React Router DOM 6.8.1**: Client-side routing
- **Tailwind CSS 3.2.7**: Utility-first CSS framework
- **Axios 1.13.2**: HTTP client (backend API ile iletişim)
- **Lucide React 0.263.1**: Icon library

---

## 🏗️ Proje Yapısı

```
src/
├── index.js              # React uygulamasının giriş noktası
├── App.js                # Ana uygulama component'i (routing)
├── index.css             # Global CSS (Tailwind directives)
├── config/
│   └── api.js            # Axios API configuration
├── components/
│   ├── Header.js         # Navigation bar component
│   ├── Footer.js         # Footer component
│   ├── ProtectedRoute.js # Route protection component
│   └── Toast.js          # Toast notification component
└── pages/
    ├── Blog.js           # Ana sayfa - Blog listesi
    ├── BlogPost.js       # Blog yazısı detay sayfası
    ├── Category.js       # Kategori filtreleme sayfası
    ├── PostForm.js       # Post oluşturma/düzenleme formu
    ├── Login.js          # Giriş sayfası
    ├── Contact.js        # İletişim formu
    ├── AdminDashboard.js # Admin dashboard
    ├── AdminPosts.js     # Admin post yönetimi
    └── AdminCategories.js # Admin kategori yönetimi
```

---

## 🔧 Core Configuration

### 1. `src/index.js` - Uygulama Giriş Noktası

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Açıklama:**
- React uygulamasını DOM'a mount eder
- `React.StrictMode` ile development modunda ekstra kontroller yapar
- `App` component'ini render eder

---

### 2. `src/config/api.js` - API Configuration

**Özellikler:**
- **Base URL**: `http://localhost:5001/api`
- **Request Interceptor**: Her istekte token'ı otomatik ekler
- **Response Interceptor**: 401 hatası durumunda otomatik logout yapar

**Kod Detayları:**

```javascript
// Axios instance oluşturma
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Token ekleme
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// Response Interceptor - Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Kullanım:**
```javascript
import api from '../config/api';

// GET request
const response = await api.get('/posts');

// POST request
await api.post('/posts', { title: '...', content: '...' });
```

---

## 🧩 Components

### 1. `Header.js` - Navigation Bar

**Özellikler:**
- Responsive tasarım (mobile/desktop)
- Kullanıcı authentication durumuna göre dinamik menü
- Role-based navigation (admin/user)
- Logout işlemi (loading state ile)

**State Management:**
```javascript
const [isMenuOpen, setIsMenuOpen] = useState(false);  // Mobile menu toggle
const [user, setUser] = useState(null);               // Kullanıcı bilgisi
const [isLoggingOut, setIsLoggingOut] = useState(false); // Logout loading
```

**Dinamik Navigation:**
- **Tüm kullanıcılar**: Ana Sayfa
- **Non-admin kullanıcılar**: İletişim linki gösterilir
- **Admin kullanıcılar**: Admin paneli linki gösterilir, İletişim gizlenir

**Logout İşlemi:**
```javascript
const handleLogout = () => {
  setIsLoggingOut(true);
  setTimeout(() => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }, 1000);
};
```

---

### 2. `Footer.js` - Footer Component

**Özellikler:**
- Basit footer yapısı
- Logo ve linkler
- Copyright bilgisi
- Responsive tasarım

---

### 3. `ProtectedRoute.js` - Route Protection

**Özellikler:**
- Authentication kontrolü
- Role-based access control (admin/user)
- Otomatik redirect

**Kod:**
```javascript
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
```

**Kullanım:**
```javascript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 📄 Pages

### 1. `Blog.js` - Ana Sayfa (Blog Listesi)

**URL:** `/`

**Özellikler:**
- Blog yazılarını listeleme
- Kategori filtreleme
- Arama özelliği
- Pagination
- Loading state
- Backend API entegrasyonu

**State Management:**
```javascript
const [searchTerm, setSearchTerm] = useState('');        // Arama terimi
const [selectedCategory, setSelectedCategory] = useState('all'); // Seçili kategori
const [currentPage, setCurrentPage] = useState(1);       // Mevcut sayfa
const [user, setUser] = useState(null);                  // Kullanıcı bilgisi
const [blogPosts, setBlogPosts] = useState([]);          // Blog yazıları
const [categories, setCategories] = useState([]);        // Kategoriler
const [loading, setLoading] = useState(true);            // Loading durumu
const [totalPages, setTotalPages] = useState(1);         // Toplam sayfa sayısı
```

**API İşlemleri:**

1. **Kategorileri Çekme:**
```javascript
const fetchCategories = async () => {
  const response = await api.get('/categories');
  const cats = [{ id: 'all', name: 'Tümü' }, ...response.data.map(cat => ({
    id: cat._id || cat.slug,
    name: cat.name
  }))];
  setCategories(cats);
};
```

2. **Postları Çekme:**
```javascript
const fetchPosts = async () => {
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
  // Data transformation...
};
```

**UI Bileşenleri:**
- **Sidebar**: Kategoriler listesi
- **Search Bar**: Arama input'u
- **Post Cards**: Her post için card component
- **Pagination**: Sayfa numaraları ve navigation

---

### 2. `BlogPost.js` - Blog Yazısı Detay Sayfası

**URL:** `/post/:id`

**Özellikler:**
- Post detayını gösterme
- Yorumları listeleme
- Yorum ekleme
- Post beğenme (like)
- Bookmark (şimdilik sadece UI)
- Admin için edit/delete butonları

**State Management:**
```javascript
const [isLiked, setIsLiked] = useState(false);           // Beğeni durumu
const [isBookmarked, setIsBookmarked] = useState(false); // Bookmark durumu
const [newComment, setNewComment] = useState('');        // Yeni yorum metni
const [user, setUser] = useState(null);                  // Kullanıcı bilgisi
const [blogPost, setBlogPost] = useState(null);          // Post detayı
const [comments, setComments] = useState([]);           // Yorumlar listesi
const [likesCount, setLikesCount] = useState(0);        // Beğeni sayısı
const [loading, setLoading] = useState(true);            // Loading durumu
```

**API İşlemleri:**

1. **Post Detayını Çekme:**
```javascript
const fetchPost = async () => {
  const response = await api.get(`/posts/${id}`);
  const post = response.data;
  
  // User'ın beğenip beğenmediğini kontrol et
  const userData = localStorage.getItem('user');
  if (userData && post.likes) {
    const currentUser = JSON.parse(userData);
    setIsLiked(post.likes.includes(currentUser.id));
  }
  
  setLikesCount(post.likes?.length || 0);
  setBlogPost(transformedPost);
};
```

2. **Yorumları Çekme:**
```javascript
const fetchComments = async () => {
  const response = await api.get(`/comments/post/${id}`);
  const transformedComments = response.data.map(comment => ({
    id: comment._id,
    author: comment.authorName,
    content: comment.text,
    date: new Date(comment.submissionDate).toLocaleDateString('tr-TR'),
    likes: comment.likes?.length || 0
  }));
  setComments(transformedComments);
};
```

3. **Post Beğenme:**
```javascript
const handleLike = async () => {
  if (!user) {
    navigate('/login');
    return;
  }
  
  const response = await api.post(`/posts/${id}/like`);
  setIsLiked(response.data.isLiked);
  setLikesCount(response.data.likes);
};
```

4. **Yorum Ekleme:**
```javascript
const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    navigate('/login');
    return;
  }
  
  await api.post(`/posts/${id}/comments`, {
    authorName: user.name || user.username,
    text: newComment
  });
  
  setNewComment('');
  fetchComments(); // Yorumları yenile
};
```

**UI Bileşenleri:**
- **Post Header**: Başlık, yazar, tarih
- **Post Content**: HTML içerik
- **Action Buttons**: Like, Bookmark, Share
- **Comments Section**: Yorum listesi ve form

---

### 3. `Category.js` - Kategori Filtreleme Sayfası

**URL:** `/category/:id`

**Özellikler:**
- Kategoriye göre post filtreleme
- Arama özelliği
- Pagination
- Backend API entegrasyonu

**Çalışma Mantığı:**
- URL'den kategori ID'sini alır (`useParams`)
- Backend'e kategori ID ile istek gönderir
- Filtrelenmiş postları gösterir

---

### 4. `PostForm.js` - Post Oluşturma/Düzenleme Formu

**URL:** `/post/new` (yeni) veya `/post/edit/:id` (düzenleme)

**Özellikler:**
- Post oluşturma
- Post düzenleme
- Kategori seçimi (API'den çekiliyor)
- Tag ekleme
- Resim yükleme (preview)
- Protected route (giriş gerekli)

**State Management:**
```javascript
const [formData, setFormData] = useState({
  title: '',
  content: '',
  category: '',
  tags: '',
  excerpt: ''
});
const [image, setImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [categories, setCategories] = useState([]);
```

**API İşlemleri:**

1. **Kategorileri Çekme:**
```javascript
const fetchCategories = async () => {
  const response = await api.get('/categories');
  setCategories(response.data);
};
```

2. **Post Kaydetme:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const submitData = {
    title: formData.title,
    content: formData.content,
    excerpt: formData.excerpt,
    category: formData.category,
    tags: formData.tags.split(',').map(tag => tag.trim()),
    image: imagePreview || null
  };

  if (isEditMode) {
    await api.put(`/posts/${id}`, submitData);
  } else {
    await api.post('/posts', submitData);
  }
  
  navigate('/');
};
```

---

### 5. `Login.js` - Giriş Sayfası

**URL:** `/login`

**Özellikler:**
- Email/password ile giriş
- Admin/user toggle (UI only, backend'de email'e göre belirlenir)
- Loading state
- Error handling
- Backend API entegrasyonu

**State Management:**
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  isAdmin: false  // UI için, backend'de kullanılmaz
});
const [showPassword, setShowPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
```

**Login İşlemi:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await api.post('/auth/login', {
      email: formData.email.toLowerCase().trim(),
      password: formData.password
    });

    if (response.data && response.data.user && response.data.token) {
      const userData = {
        id: response.data.user.id || response.data.user._id,
        name: response.data.user.username || response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role || 'user',
        token: response.data.token,
        avatar: '...'
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Role'e göre yönlendirme
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  } catch (err) {
    setError(err.response?.data?.error || 'Giriş yapılırken bir hata oluştu.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 6. `Contact.js` - İletişim Formu

**URL:** `/contact`

**Özellikler:**
- İletişim formu
- Form validation
- Success message
- Backend API entegrasyonu

**Form Submit:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/contact', formData);
    setIsSubmitted(true);
    // Form reset...
  } catch (error) {
    alert('Mesaj gönderilirken bir hata oluştu.');
  }
};
```

---

### 7. `AdminDashboard.js` - Admin Dashboard

**URL:** `/admin`

**Özellikler:**
- İstatistikler (posts, categories, users, comments)
- Son yazılar listesi
- Hızlı işlemler
- Backend API entegrasyonu
- Protected route (admin only)

**API İşlemleri:**
```javascript
const fetchDashboardData = async () => {
  const [statsResponse, postsResponse] = await Promise.all([
    api.get('/statistics/dashboard'),
    api.get('/posts', { params: { limit: 3, sortBy: 'createdAt', order: 'desc' } })
  ]);

  // Stats ve posts'u state'e set et
};
```

---

### 8. `AdminPosts.js` - Admin Post Yönetimi

**URL:** `/admin/posts`

**Özellikler:**
- Tüm postları listeleme
- Post silme
- Post düzenleme linki
- Arama özelliği
- Backend API entegrasyonu

**API İşlemleri:**
```javascript
const fetchPosts = async () => {
  const response = await api.get('/posts', { params: { limit: 100 } });
  // Transform ve set posts
};

const handleDelete = async (id) => {
  if (window.confirm('Silmek istediğinizden emin misiniz?')) {
    await api.delete(`/posts/${id}`);
    fetchPosts(); // Listeyi yenile
  }
};
```

---

### 9. `AdminCategories.js` - Admin Kategori Yönetimi

**URL:** `/admin/categories`

**Özellikler:**
- Kategori listeleme
- Kategori ekleme
- Kategori düzenleme
- Kategori silme
- Backend API entegrasyonu

**CRUD İşlemleri:**
```javascript
// Create
const handleAddCategory = async (e) => {
  await api.post('/categories', {
    name: newCategoryName,
    description: newCategoryDescription
  });
  fetchCategories();
};

// Update
const handleUpdateCategory = async (e) => {
  await api.put(`/categories/${editCategoryId}`, {
    name: editCategoryName,
    description: editCategoryDescription
  });
  fetchCategories();
};

// Delete
const handleDeleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
  fetchCategories();
};
```

---

## 🔄 Data Flow (Veri Akışı)

### 1. Authentication Flow

```
User → Login.js → API POST /auth/login
                ↓
         Backend validates
                ↓
         Returns: { user, token }
                ↓
         localStorage.setItem('user', ...)
                ↓
         Navigate to /admin or /
```

### 2. Post List Flow

```
Blog.js → useEffect → api.get('/posts')
                    ↓
             Backend returns posts
                    ↓
         Transform data format
                    ↓
         setBlogPosts(transformedPosts)
                    ↓
         Render post cards
```

### 3. Like Flow

```
User clicks like → handleLike() → api.post('/posts/:id/like')
                                    ↓
                            Backend updates DB
                                    ↓
                            Returns: { isLiked, likes }
                                    ↓
                            Update UI state
```

### 4. Comment Flow

```
User submits comment → handleCommentSubmit() → api.post('/posts/:id/comments')
                                                ↓
                                        Backend saves comment
                                                ↓
                                        fetchComments() → Refresh list
```

---

## 🎨 Styling (Tailwind CSS)

### Utility Classes Kullanımı

**Layout:**
- `flex`, `grid`: Layout sistemleri
- `max-w-7xl`: Container genişliği
- `mx-auto`: Merkezleme

**Spacing:**
- `p-4`, `px-6`, `py-8`: Padding
- `m-4`, `mt-8`, `mb-6`: Margin
- `space-x-4`, `space-y-6`: Child element spacing

**Colors:**
- `bg-primary-600`: Primary renk
- `text-gray-900`: Text renkleri
- `border-gray-300`: Border renkleri

**Responsive:**
- `md:flex`: Medium ekran ve üzeri
- `lg:grid-cols-4`: Large ekran grid
- `sm:px-6`: Small ekran padding

---

## 🔐 Authentication & Authorization

### Token Management

1. **Login'de token alınır:**
```javascript
const response = await api.post('/auth/login', { email, password });
localStorage.setItem('user', JSON.stringify({
  ...userData,
  token: response.data.token
}));
```

2. **Her API isteğinde token gönderilir:**
```javascript
// api.js interceptor'da otomatik eklenir
config.headers.Authorization = `Bearer ${user.token}`;
```

3. **401 hatası durumunda otomatik logout:**
```javascript
if (error.response?.status === 401) {
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

### Role-Based Access

- **ProtectedRoute**: Authentication kontrolü
- **requireAdmin prop**: Admin-only routes
- **Conditional rendering**: UI'da role'e göre gösterim

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Mobile-First Approach
- Tüm component'ler mobile için optimize edilmiş
- Desktop için `md:` prefix'leri ile genişletilmiş

---

## 🚀 Performance Optimizations

1. **Lazy Loading**: Route-based code splitting (React Router)
2. **API Caching**: Axios interceptor ile token caching
3. **Conditional Rendering**: Gereksiz render'ları önleme
4. **Loading States**: UX için loading göstergeleri

---

## 🐛 Error Handling

1. **API Errors**: Try-catch blokları
2. **Network Errors**: Axios interceptor'da handle edilir
3. **User Feedback**: Error mesajları gösterilir
4. **Fallback UI**: Loading ve error state'leri

---

## 📦 State Management

### Local State (useState)
- Component-specific state
- Form data
- UI state (loading, errors)

### Global State (localStorage)
- User authentication data
- Token storage

### Server State (API)
- Posts, categories, comments
- Real-time data fetching

---

## 🔄 Lifecycle & Effects

### useEffect Kullanımları

1. **Component mount:**
```javascript
useEffect(() => {
  fetchData();
}, []);
```

2. **Dependency-based:**
```javascript
useEffect(() => {
  fetchPosts();
}, [currentPage, selectedCategory]);
```

3. **Cleanup:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {...}, 1000);
  return () => clearTimeout(timer);
}, []);
```

---

## 🎯 Key Features

### ✅ Tamamlanan Özellikler

1. **Authentication System**
   - Login/Logout
   - Token-based auth
   - Role-based access

2. **Blog Management**
   - Post listeleme
   - Post detayı
   - Post oluşturma/düzenleme
   - Post silme (admin)

3. **Category Management**
   - Kategori listeleme
   - Kategori filtreleme
   - Admin kategori CRUD

4. **Comment System**
   - Yorum listeleme
   - Yorum ekleme
   - Yorum beğenme

5. **Like System**
   - Post beğenme
   - Beğeni sayısı
   - Like state management

6. **Admin Panel**
   - Dashboard
   - Post yönetimi
   - Kategori yönetimi

7. **Responsive Design**
   - Mobile-first
   - Desktop optimization

---

## 🔗 API Endpoints Kullanımı

### Posts
- `GET /api/posts` - Post listesi
- `GET /api/posts/:id` - Post detayı
- `POST /api/posts` - Yeni post (admin)
- `PUT /api/posts/:id` - Post güncelle (admin)
- `DELETE /api/posts/:id` - Post sil (admin)
- `POST /api/posts/:id/like` - Post beğen
- `POST /api/posts/:id/comments` - Yorum ekle

### Categories
- `GET /api/categories` - Kategori listesi
- `POST /api/categories` - Yeni kategori (admin)
- `PUT /api/categories/:id` - Kategori güncelle (admin)
- `DELETE /api/categories/:id` - Kategori sil (admin)

### Comments
- `GET /api/comments/post/:postId` - Post yorumları
- `POST /api/comments/post/:postId` - Yorum ekle
- `POST /api/comments/:id/like` - Yorum beğen

### Auth
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Mevcut kullanıcı

### Contact
- `POST /api/contact` - İletişim mesajı gönder

### Statistics
- `GET /api/statistics/dashboard` - Dashboard istatistikleri (admin)

---

## 🎨 UI/UX Features

1. **Loading States**: Tüm async işlemlerde
2. **Error Messages**: Kullanıcı dostu hata mesajları
3. **Success Feedback**: Form submit'lerde
4. **Smooth Transitions**: CSS transitions
5. **Hover Effects**: Interactive elements
6. **Disabled States**: Form validation

---


## 📚 Özet

PenLink frontend'i modern React best practices kullanılarak geliştirilmiş, tam özellikli bir blog platformudur. Backend API ile tam entegre çalışır, kullanıcı authentication, role-based access control, ve tüm CRUD işlemlerini destekler. Responsive tasarım ve iyi UX/UI pratikleri ile kullanıcı dostu bir deneyim sunar.


