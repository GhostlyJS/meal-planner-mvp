import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await axios.get('/auth/validate-token');
          setUser(res.data.user);
        } catch (err) {
          console.error('Token validation failed:', err);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, [token]);

  // Configuration de l'en-tête d'autorisation pour toutes les requêtes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : { message: 'Network error' };
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : { message: 'Network error' };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};