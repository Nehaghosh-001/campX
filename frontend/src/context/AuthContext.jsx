import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, notificationApi } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const token = localStorage.getItem('access_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        fetchCurrentUser();
      } catch (e) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data);
      localStorage.setItem('user_data', JSON.stringify(res.data));
    } catch (e) {
      console.error("Failed to load user profile", e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.list();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (e) {
      // ignore
    }
  };

  const loginWithTokens = (tokens, userData) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
  };

  const demoLogin = async (role) => {
    try {
      const res = await authApi.demoLogin(role);
      loginWithTokens(res.data.tokens, res.data.user);
      return res.data;
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const markNotificationRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        setUser,
        loginWithTokens,
        demoLogin,
        logout,
        notifications,
        unreadCount,
        fetchNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
