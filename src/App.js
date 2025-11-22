import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PostForm from './pages/PostForm';
import Category from './pages/Category';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminCategories from './pages/AdminCategories';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Blog />} />
            <Route path="/post/:id" element={<BlogPost />} />
            <Route 
              path="/post/new" 
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post/edit/:id" 
              element={
                <ProtectedRoute>
                  <PostForm />
                </ProtectedRoute>
              } 
            />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPosts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCategories />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
