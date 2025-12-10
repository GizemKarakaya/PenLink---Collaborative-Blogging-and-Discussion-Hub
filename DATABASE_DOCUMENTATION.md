# Database Documentation

## Genel Bakış

PenLink blog uygulaması MongoDB veritabanı kullanır. MongoDB Atlas (cloud) üzerinde barındırılmaktadır. Mongoose ODM (Object Document Mapper) ile yönetilir.

## Veritabanı Yapısı

### Collections

1. **users** - Kullanıcı bilgileri
2. **posts** - Blog yazıları
3. **comments** - Post yorumları
4. **categories** - Kategori bilgileri
5. **contactmessages** - İletişim mesajları
6. **tags** - Etiket bilgileri (şu an kullanılmıyor, post içinde array olarak tutuluyor)

## Schema Detayları

### User Schema

**Collection**: `users`

**Fields:**
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
    // bcrypt ile hash'lenir (10 salt rounds)
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Methods:**
- `comparePassword(candidatePassword)`: Şifre karşılaştırma

**Hooks:**
- `pre('save')`: Password'ü bcrypt ile hash'ler

**Indexes:**
- `username`: unique
- `email`: unique

**Örnek Document:**
```json
{
  "_id": ObjectId("..."),
  "username": "testuser",
  "email": "test@example.com",
  "password": "$2a$10$...",
  "role": "user",
  "createdAt": ISODate("2025-12-10T10:00:00.000Z")
}
```

---

### Post Schema

**Collection**: `posts`

**Fields:**
```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: null
    // Base64 string veya URL
  },
  likes: [{
    type: ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `{ category: 1, createdAt: -1 }`: Kategori ve tarih sıralaması için
- `{ author: 1 }`: Yazar sorguları için

**Relationships:**
- `author` → `User` (Many-to-One)
- `category` → `Category` (Many-to-One)
- `likes` → `User[]` (Many-to-Many)

**Örnek Document:**
```json
{
  "_id": ObjectId("..."),
  "title": "Blog Post Title",
  "content": "Full post content...",
  "excerpt": "Short excerpt...",
  "author": ObjectId("user_id"),
  "category": ObjectId("category_id"),
  "tags": ["technology", "web"],
  "image": "data:image/png;base64,...",
  "likes": [ObjectId("user_id1"), ObjectId("user_id2")],
  "createdAt": ISODate("2025-12-10T10:00:00.000Z")
}
```

---

### Comment Schema

**Collection**: `comments`

**Fields:**
```javascript
{
  post: {
    type: ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: false
    // Optional - anonymous comments için
  },
  authorName: {
    type: String,
    required: false
    // Required if author is null (validated in pre-validate hook)
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  likes: [{
    type: ObjectId,
    ref: 'User'
  }],
  submissionDate: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `{ post: 1, submissionDate: -1 }`: Post yorumları için sıralama

**Hooks:**
- `pre('validate')`: `author` yoksa `authorName` zorunlu

**Relationships:**
- `post` → `Post` (Many-to-One)
- `author` → `User` (Many-to-One, optional)
- `likes` → `User[]` (Many-to-Many)

**Örnek Document (Authenticated):**
```json
{
  "_id": ObjectId("..."),
  "post": ObjectId("post_id"),
  "author": ObjectId("user_id"),
  "authorName": null,
  "text": "Great post!",
  "likes": [],
  "submissionDate": ISODate("2025-12-10T10:00:00.000Z")
}
```

**Örnek Document (Anonymous):**
```json
{
  "_id": ObjectId("..."),
  "post": ObjectId("post_id"),
  "author": null,
  "authorName": "Anonymous User",
  "text": "Nice article!",
  "likes": [],
  "submissionDate": ISODate("2025-12-10T10:00:00.000Z")
}
```

---

### Category Schema

**Collection**: `categories`

**Fields:**
```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
    // Auto-generated from name
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `name`: unique
- `slug`: unique

**Hooks:**
- `pre('save')`: `name` değiştiğinde `slug` oluşturur
  - Türkçe karakterleri dönüştürür (ğ→g, ü→u, ş→s, ı→i, ö→o, ç→c)
  - Küçük harfe çevirir
  - Özel karakterleri tire ile değiştirir

**Relationships:**
- `Post` → `Category` (Many-to-One, reverse)

**Örnek Document:**
```json
{
  "_id": ObjectId("..."),
  "name": "Teknoloji",
  "description": "Teknoloji ile ilgili yazılar",
  "slug": "teknoloji",
  "createdAt": ISODate("2025-12-10T10:00:00.000Z"),
  "updatedAt": ISODate("2025-12-10T10:00:00.000Z")
}
```

---

### ContactMessage Schema

**Collection**: `contactmessages`

**Fields:**
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- Yok (basit collection)

**Örnek Document:**
```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question...",
  "submissionDate": ISODate("2025-12-10T10:00:00.000Z")
}
```

---

### Tag Schema

**Collection**: `tags`

**Not**: Şu anda kullanılmıyor. Tags post içinde array olarak tutuluyor. Gelecekte ayrı collection olarak kullanılabilir.

**Fields:**
```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## İlişkiler (Relationships)

### 1. User ↔ Post
- **Type**: One-to-Many
- **User → Post**: Bir kullanıcı birden fazla post oluşturabilir
- **Post → User**: Her post bir kullanıcıya aittir
- **Implementation**: `Post.author` → `User._id` (ObjectId reference)

### 2. Post ↔ Category
- **Type**: Many-to-One
- **Post → Category**: Bir post bir kategoriye aittir
- **Category → Post**: Bir kategori birden fazla post içerebilir
- **Implementation**: `Post.category` → `Category._id` (ObjectId reference)

### 3. Post ↔ Comment
- **Type**: One-to-Many
- **Post → Comment**: Bir post birden fazla yorum içerebilir
- **Comment → Post**: Her yorum bir posta aittir
- **Implementation**: `Comment.post` → `Post._id` (ObjectId reference)
- **Note**: Comments ayrı collection'da (embedded değil)

### 4. User ↔ Comment
- **Type**: Many-to-One (optional)
- **User → Comment**: Bir kullanıcı birden fazla yorum yazabilir
- **Comment → User**: Her yorum bir kullanıcıya ait olabilir (optional - anonymous comments)
- **Implementation**: `Comment.author` → `User._id` (ObjectId reference, optional)

### 5. User ↔ Post (Likes)
- **Type**: Many-to-Many
- **User → Post**: Bir kullanıcı birden fazla postu beğenebilir
- **Post → User**: Bir post birden fazla kullanıcı tarafından beğenilebilir
- **Implementation**: `Post.likes` → `User._id[]` (Array of ObjectId references)

### 6. User ↔ Comment (Likes)
- **Type**: Many-to-Many
- **User → Comment**: Bir kullanıcı birden fazla yorumu beğenebilir
- **Comment → User**: Bir yorum birden fazla kullanıcı tarafından beğenilebilir
- **Implementation**: `Comment.likes` → `User._id[]` (Array of ObjectId references)

---

## Indexes

### Performance Indexes

1. **posts**
   - `{ category: 1, createdAt: -1 }`: Kategoriye göre post listeleme
   - `{ author: 1 }`: Yazar postlarını getirme

2. **comments**
   - `{ post: 1, submissionDate: -1 }`: Post yorumlarını tarihe göre sıralama

### Unique Indexes

1. **users**
   - `username`: unique
   - `email`: unique

2. **categories**
   - `name`: unique
   - `slug`: unique

3. **tags** (şu an kullanılmıyor)
   - `name`: unique

---

## Veri Tipleri

### ObjectId
MongoDB'nin benzersiz identifier'ı. Mongoose tarafından otomatik oluşturulur.

**Örnek**: `ObjectId("507f1f77bcf86cd799439011")`

### Date
ISO 8601 formatında tarih.

**Örnek**: `ISODate("2025-12-10T10:00:00.000Z")`

### String
UTF-8 string. `trim: true` ile baş/son boşluklar otomatik temizlenir.

### Array
MongoDB array. ObjectId array'leri reference olarak kullanılır.

---

## Populate (Referans Doldurma)

Mongoose `populate()` metodu ile referans alanlar doldurulur:

```javascript
// Post'u author ve category ile birlikte getir
Post.findById(id)
  .populate('author', 'username email')
  .populate('category', 'name slug')
  .exec();

// Comment'leri author ile birlikte getir
Comment.find({ post: postId })
  .populate('author', 'username email')
  .exec();
```

---

## Aggregation Örnekleri

### Comment Count Hesaplama

```javascript
const commentCounts = await Comment.aggregate([
  { $match: { post: { $in: postIds } } },
  { $group: { _id: '$post', count: { $sum: 1 } } }
]);
```

### Posts Per Category

```javascript
const postsPerCategory = await Post.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $lookup: {
      from: 'categories',
      localField: '_id',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: '$category' },
  { $project: {
      _id: 1,
      name: '$category.name',
      count: 1
    }
  }
]);
```

---

## Seed Data

`seed.js` scripti ile veritabanı başlangıç verileriyle doldurulur:

1. **Users**: Admin ve test kullanıcıları
2. **Categories**: Varsayılan kategoriler
3. **Posts**: Örnek blog yazıları
4. **Comments**: Örnek yorumlar

**Çalıştırma:**
```bash
npm run seed
```

---

## MongoDB Atlas Konfigürasyonu

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Gereksinimler

1. **IP Whitelist**: MongoDB Atlas'ta IP adresleri whitelist'e eklenmeli
   - Development: `0.0.0.0/0` (tüm IP'ler) veya spesifik IP
   - Production: Sadece server IP'leri

2. **Database User**: MongoDB Atlas'ta database user oluşturulmalı
   - Username ve password `.env` dosyasında tanımlanmalı

3. **Network Access**: MongoDB Atlas Network Access ayarları kontrol edilmeli

---

## Veri Güvenliği

1. **Password Hashing**: bcryptjs ile 10 salt rounds
2. **Input Validation**: Mongoose schema validation
3. **Unique Constraints**: Email, username, category name, slug
4. **Reference Integrity**: ObjectId referansları ile ilişkiler

---

## Notlar

- Tüm tarihler UTC formatında saklanır
- Image'ler base64 string olarak saklanır (production'da cloud storage önerilir)
- Tags şu anda post içinde array olarak tutuluyor, gelecekte ayrı collection olabilir
- Comments ayrı collection'da (embedded değil) - daha iyi performans ve esneklik için
- Anonymous comments desteklenir (`author` null olabilir, `authorName` gerekli)

