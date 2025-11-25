# PenLink Backend API

Backend API for PenLink - Collaborative Blogging Platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/penlink
JWT_SECRET=your-secret-key-change-this-in-production
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination, filtering)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)
- `POST /api/posts/:id/comments` - Add comment to post

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments/post/:postId` - Create comment (authenticated)
- `POST /api/comments/:id/like` - Like/unlike comment (authenticated)
- `DELETE /api/comments/:id` - Delete comment (admin or owner)

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all messages (admin only)
- `GET /api/contact/:id` - Get message by ID (admin only)

### Statistics
- `GET /api/statistics/posts-per-category` - Get posts per category stats
- `GET /api/statistics/dashboard` - Get dashboard stats (admin only)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
