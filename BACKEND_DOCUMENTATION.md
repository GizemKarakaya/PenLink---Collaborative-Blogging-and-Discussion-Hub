# Backend Documentation

## Genel Bakış

PenLink blog uygulamasının backend'i Node.js, Express.js ve MongoDB kullanılarak geliştirilmiştir. RESTful API yapısı ile frontend ile iletişim kurar.

## Teknoloji Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB (MongoDB Atlas)
- **ODM**: Mongoose 7.5.0
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs 2.4.3
- **CORS**: cors 2.8.5
- **Environment Variables**: dotenv 16.3.1

## Proje Yapısı

```
server/
├── server.js              # Ana server dosyası
├── package.json           # Bağımlılıklar ve scriptler
├── seed.js                # Veritabanı seed scripti
├── .env                   # Environment variables
├── models/                # Mongoose modelleri
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Category.js
│   ├── ContactMessage.js
│   └── Tag.js
├── controllers/           # İş mantığı (business logic)
│   ├── authController.js
│   ├── postController.js
│   ├── categoryController.js
│   ├── commentController.js
│   ├── contactController.js
│   └── statisticsController.js
├── routes/                # API route tanımları
│   ├── authRoutes.js
│   ├── postRoutes.js
│   ├── categoryRoutes.js
│   ├── commentRoutes.js
│   ├── contactRoutes.js
│   └── statisticsRoutes.js
└── middleware/           # Middleware fonksiyonları
    └── auth.js
```

## Server Konfigürasyonu

### server.js

Ana server dosyası Express uygulamasını başlatır ve MongoDB bağlantısını yönetir.

**Özellikler:**
- CORS desteği
- JSON body parser (50MB limit)
- URL encoded body parser (50MB limit)
- MongoDB Atlas bağlantısı
- Error handling middleware
- Health check endpoint

**Port**: `process.env.PORT || 5000` (varsayılan: 5000)

**MongoDB Bağlantısı:**
- Connection string: `process.env.MONGODB_URI`
- Timeout ayarları: 5s server selection, 45s socket timeout

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Yeni kullanıcı kaydı oluşturur.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

#### POST `/api/auth/login`
Kullanıcı girişi yapar.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user|admin"
  }
}
```

#### GET `/api/auth/me`
Mevcut kullanıcı bilgilerini getirir. (Protected)

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "string",
  "email": "string",
  "role": "user|admin",
  "createdAt": "date"
}
```

---

### Posts (`/api/posts`)

#### GET `/api/posts`
Tüm postları getirir. Filtreleme ve sıralama desteği vardır.

**Query Parameters:**
- `categoryId`: Kategori ID'sine göre filtreleme
- `sortBy`: Sıralama alanı (varsayılan: `createdAt`)
- `order`: Sıralama yönü (`asc` veya `desc`, varsayılan: `desc`)
- `page`: Sayfa numarası (varsayılan: 1)
- `limit`: Sayfa başına kayıt sayısı (varsayılan: 10)

**Response:**
```json
{
  "posts": [
    {
      "_id": "post_id",
      "title": "string",
      "content": "string",
      "excerpt": "string",
      "author": {
        "_id": "user_id",
        "username": "string",
        "email": "string"
      },
      "category": {
        "_id": "category_id",
        "name": "string",
        "slug": "string"
      },
      "tags": ["string"],
      "image": "string",
      "likes": ["user_id"],
      "likesCount": 0,
      "commentCount": 0,
      "createdAt": "date"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

#### GET `/api/posts/:id`
Belirli bir postu getirir.

**Response:**
```json
{
  "_id": "post_id",
  "title": "string",
  "content": "string",
  "excerpt": "string",
  "author": {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user|admin"
  },
  "category": {
    "_id": "category_id",
    "name": "string",
    "slug": "string"
  },
  "tags": ["string"],
  "image": "string",
  "likes": ["user_id"],
  "likesCount": 0,
  "commentCount": 0,
  "createdAt": "date"
}
```

#### POST `/api/posts`
Yeni post oluşturur. (Protected - Authenticated users)

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "excerpt": "string (optional)",
  "category": "category_id (required)",
  "tags": ["string"],
  "image": "string (base64 or URL)"
}
```

**Response:**
```json
{
  "_id": "post_id",
  "title": "string",
  "content": "string",
  "excerpt": "string",
  "author": "user_id",
  "category": "category_id",
  "tags": ["string"],
  "image": "string",
  "likes": [],
  "createdAt": "date"
}
```

#### PUT `/api/posts/:id`
Postu günceller. (Protected - Admin only)

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Request Body:** (POST ile aynı, tüm alanlar optional)

#### DELETE `/api/posts/:id`
Postu siler. (Protected - Admin only)

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

#### POST `/api/posts/:id/like`
Postu beğenir/beğeniyi kaldırır. (Protected - Authenticated users)

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
{
  "isLiked": true,
  "likes": 1
}
```

#### POST `/api/posts/:id/comments`
Posta yorum ekler. (Optional authentication - Anonymous users can comment)

**Headers (Optional):**
```
Authorization: Bearer JWT_TOKEN
```

**Request Body:**
```json
{
  "text": "string (required)",
  "authorName": "string (required if not authenticated)"
}
```

**Response:**
```json
{
  "_id": "comment_id",
  "post": "post_id",
  "author": "user_id (or null)",
  "authorName": "string (if anonymous)",
  "text": "string",
  "likes": [],
  "submissionDate": "date"
}
```

---

### Categories (`/api/categories`)

#### GET `/api/categories`
Tüm kategorileri getirir.

**Response:**
```json
[
  {
    "_id": "category_id",
    "name": "string",
    "description": "string",
    "slug": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### GET `/api/categories/:id`
Belirli bir kategoriyi getirir.

#### GET `/api/categories/slug/:slug`
Slug'a göre kategori getirir.

#### POST `/api/categories`
Yeni kategori oluşturur. (Protected - Admin only)

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

#### PUT `/api/categories/:id`
Kategoriyi günceller. (Protected - Admin only)

#### DELETE `/api/categories/:id`
Kategoriyi siler. (Protected - Admin only)

---

### Comments (`/api/comments`)

#### GET `/api/comments/post/:postId`
Belirli bir postun yorumlarını getirir.

**Response:**
```json
[
  {
    "_id": "comment_id",
    "post": "post_id",
    "author": {
      "_id": "user_id",
      "username": "string",
      "email": "string"
    },
    "authorName": "string (if anonymous)",
    "text": "string",
    "likes": ["user_id"],
    "submissionDate": "date"
  }
]
```

#### POST `/api/comments/post/:postId`
Yorum oluşturur. (Optional authentication)

**Request Body:**
```json
{
  "text": "string (required)",
  "authorName": "string (required if not authenticated)"
}
```

#### POST `/api/comments/:id/like`
Yorumu beğenir/beğeniyi kaldırır. (Protected - Authenticated users)

#### DELETE `/api/comments/:id`
Yorumu siler. (Protected - Authenticated users)

---

### Contact (`/api/contact`)

#### POST `/api/contact`
İletişim mesajı gönderir.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "message": "string (required)"
}
```

**Response:**
```json
{
  "message": "Contact message submitted successfully",
  "contactMessage": {
    "_id": "message_id",
    "name": "string",
    "email": "string",
    "message": "string",
    "submissionDate": "date"
  }
}
```

#### GET `/api/contact`
Tüm iletişim mesajlarını getirir. (Protected - Admin only)

#### GET `/api/contact/:id`
Belirli bir mesajı getirir. (Protected - Admin only)

#### DELETE `/api/contact/:id`
Mesajı siler. (Protected - Admin only)

---

### Statistics (`/api/statistics`)

#### GET `/api/statistics/posts-per-category`
Kategori başına post sayısını getirir.

**Response:**
```json
[
  {
    "_id": "category_id",
    "name": "string",
    "count": 0
  }
]
```

#### GET `/api/statistics/dashboard`
Dashboard istatistiklerini getirir. (Protected - Admin only)

**Response:**
```json
{
  "totalPosts": 0,
  "totalCategories": 0,
  "totalUsers": 0,
  "totalComments": 0,
  "totalContactMessages": 0,
  "recentPosts": [
    {
      "_id": "post_id",
      "title": "string",
      "createdAt": "date"
    }
  ]
}
```

---

### Health Check

#### GET `/api/health`
Server durumunu kontrol eder.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Middleware

### Authentication Middleware (`middleware/auth.js`)

#### `authenticate`
JWT token'ı doğrular ve kullanıcıyı `req.user`'a ekler.

**Kullanım:**
```javascript
const { authenticate } = require('./middleware/auth');
router.get('/protected', authenticate, controller.handler);
```

**Hata Durumları:**
- `401`: Token yok veya geçersiz

#### `optionalAuthenticate`
Token varsa doğrular, yoksa devam eder. Yorumlar için kullanılır.

**Kullanım:**
```javascript
const { optionalAuthenticate } = require('./middleware/auth');
router.post('/comment', optionalAuthenticate, controller.handler);
```

#### `requireAdmin`
Kullanıcının admin olduğunu kontrol eder. `authenticate`'den sonra kullanılmalı.

**Kullanım:**
```javascript
const { authenticate, requireAdmin } = require('./middleware/auth');
router.delete('/post/:id', authenticate, requireAdmin, controller.handler);
```

**Hata Durumları:**
- `403`: Admin yetkisi yok

## Controllers

### authController.js

**Fonksiyonlar:**
- `register`: Yeni kullanıcı kaydı
- `login`: Kullanıcı girişi
- `getMe`: Mevcut kullanıcı bilgileri

**JWT Token:**
- Süre: 7 gün
- Secret: `process.env.JWT_SECRET`

### postController.js

**Fonksiyonlar:**
- `getAllPosts`: Tüm postları getirir (filtreleme, sıralama, sayfalama)
- `getPostById`: Belirli bir postu getirir
- `createPost`: Yeni post oluşturur
- `updatePost`: Postu günceller
- `deletePost`: Postu siler
- `likePost`: Postu beğenir/beğeniyi kaldırır
- `addComment`: Posta yorum ekler

**Özellikler:**
- Comment count hesaplama
- Likes count hesaplama
- Author ve category populate
- Validation (title, content, category required)

### categoryController.js

**Fonksiyonlar:**
- `getAllCategories`: Tüm kategorileri getirir
- `getCategoryById`: ID'ye göre kategori getirir
- `getCategoryBySlug`: Slug'a göre kategori getirir
- `createCategory`: Yeni kategori oluşturur
- `updateCategory`: Kategoriyi günceller
- `deleteCategory`: Kategoriyi siler

**Özellikler:**
- Otomatik slug oluşturma
- Türkçe karakter desteği

### commentController.js

**Fonksiyonlar:**
- `getPostComments`: Postun yorumlarını getirir
- `createComment`: Yorum oluşturur (anonymous veya authenticated)
- `likeComment`: Yorumu beğenir/beğeniyi kaldırır
- `deleteComment`: Yorumu siler

**Özellikler:**
- Anonymous yorum desteği
- Author populate

### contactController.js

**Fonksiyonlar:**
- `submitMessage`: İletişim mesajı gönderir
- `getAllMessages`: Tüm mesajları getirir (admin)
- `getMessageById`: Belirli bir mesajı getirir (admin)
- `deleteMessage`: Mesajı siler (admin)

### statisticsController.js

**Fonksiyonlar:**
- `getPostsPerCategory`: Kategori başına post sayısı
- `getDashboardStats`: Dashboard istatistikleri

## Environment Variables

`.env` dosyasında tanımlanması gereken değişkenler:

```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Error Handling

Tüm hatalar standart JSON formatında döner:

```json
{
  "error": "Error message"
}
```

**HTTP Status Kodları:**
- `200`: Başarılı
- `201`: Oluşturuldu
- `400`: Geçersiz istek
- `401`: Yetkilendirme gerekli
- `403`: Yetki yok
- `404`: Bulunamadı
- `500`: Sunucu hatası

## Security

1. **Password Hashing**: bcryptjs ile 10 salt rounds
2. **JWT Authentication**: Token tabanlı kimlik doğrulama
3. **Role-Based Access Control**: Admin ve user rolleri
4. **Input Validation**: Mongoose schema validation
5. **CORS**: Cross-origin resource sharing yapılandırması

## Scripts

```bash
# Server'ı başlat
npm start

# Development mode (nodemon ile)
npm run dev

# Veritabanını seed et
npm run seed
```

## Notlar

- Tüm tarihler ISO 8601 formatında
- Image upload base64 string olarak kabul edilir
- Body parser limit: 50MB (büyük image upload'ları için)
- MongoDB Atlas bağlantısı için IP whitelist gerekli

