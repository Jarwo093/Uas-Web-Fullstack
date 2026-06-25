import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    }
  }, [user, token]);

  // Validate token on app load by calling /api/me
  const validateToken = useCallback(async () => {
    if (!token) {
      setIsValidating(false);
      return;
    }

    try {
      const response = await api.get('/me');
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch {
      // Token is invalid — clear state
      setUser(null);
      setToken(null);
    } finally {
      setIsValidating(false);
    }
  }, [token]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.success) {
        setUser(response.data.data.user);
        setToken(response.data.data.access_token);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred during login';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ name, email, password, password_confirmation }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/register', {
        name, email, password, password_confirmation,
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        setToken(response.data.data.access_token);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error) {
      const message = error.response?.data?.message
        || error.response?.data?.errors?.email?.[0]
        || 'An error occurred during registration';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isValidating,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
