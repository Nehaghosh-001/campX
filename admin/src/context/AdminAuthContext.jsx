import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    const token = localStorage.getItem('access_token');
    if (savedUser && token) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const loginWithTokens = (tokens, user) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setAdminUser(user);
  };

  const adminDemoLogin = async () => {
    try {
      const res = await authApi.demoLogin('superadmin');
      loginWithTokens(res.data.tokens, res.data.user);
      return res.data;
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        loginWithTokens,
        adminDemoLogin,
        logout,
        isAuthenticated: !!adminUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
