import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';

// Core components
import Dashboard from './components/dashboard/Dashboard';
import RecipeList from './components/recipes/RecipeList';
import RecipeDetail from './components/recipes/RecipeDetail';
import RecipeForm from './components/recipes/RecipeForm';
import ShoppingListForm from './components/shopping/ShoppingListForm';
import ShoppingListDetail from './components/shopping/ShoppingListDetail';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Context providers
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/recipes" element={
                <PrivateRoute>
                  <RecipeList />
                </PrivateRoute>
              } />
              
              <Route path="/recipes/new" element={
                <PrivateRoute>
                  <RecipeForm />
                </PrivateRoute>
              } />
              
              <Route path="/recipes/edit/:id" element={
                <PrivateRoute>
                  <RecipeForm />
                </PrivateRoute>
              } />
              
              <Route path="/recipes/:id" element={
                <PrivateRoute>
                  <RecipeDetail />
                </PrivateRoute>
              } />
              
              <Route path="/shopping-lists/new" element={
                <PrivateRoute>
                  <ShoppingListForm />
                </PrivateRoute>
              } />
              
              <Route path="/shopping-lists/:id" element={
                <PrivateRoute>
                  <ShoppingListDetail />
                </PrivateRoute>
              } />
              
              {/* Redirect root to dashboard or login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;