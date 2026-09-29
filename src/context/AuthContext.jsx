import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campusmarket_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('campusmarket_token') || null);
  const [loading, setLoading] = useState(true);

  // Global campus filter preference (e.g. UNILAG, YABATECH, LASU or 'all')
  const [selectedCampus, setSelectedCampusState] = useState(() => {
    return localStorage.getItem('campusmarket_selected_campus') || 'all';
  });

  const setSelectedCampus = (campusIdOrShort) => {
    setSelectedCampusState(campusIdOrShort);
    localStorage.setItem('campusmarket_selected_campus', campusIdOrShort);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('campusmarket_token');
    localStorage.removeItem('campusmarket_user');
    setUser(null);
    setToken(null);
  }, []);

  // Fetch current user details on boot if token is present
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('campusmarket_token');
      if (storedToken) {
        try {
          const res = await getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('campusmarket_user', JSON.stringify(res.data));
            // Default selected campus to user's campus if not set
            if (res.data.campus && !localStorage.getItem('campusmarket_selected_campus')) {
              setSelectedCampusState(res.data.campus._id || res.data.campus);
            }
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    if (res.success && res.data) {
      localStorage.setItem('campusmarket_token', res.data.token);
      localStorage.setItem('campusmarket_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.campus) {
        setSelectedCampus(res.data.user.campus._id || res.data.user.campus);
      }
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiRegister(userData);
    if (res.success && res.data) {
      localStorage.setItem('campusmarket_token', res.data.token);
      localStorage.setItem('campusmarket_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.campus) {
        setSelectedCampus(res.data.user.campus._id || res.data.user.campus);
      }
    }
    return res;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('campusmarket_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    selectedCampus,
    setSelectedCampus,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
