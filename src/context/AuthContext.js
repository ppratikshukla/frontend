import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('attendapp_token');
    const savedUser = localStorage.getItem('attendapp_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('attendapp_token', token);
    localStorage.setItem('attendapp_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password, rollNumber) => {
    const res = await authAPI.register({ name, email, password, rollNumber });
    const { token, user: userData } = res.data;
    localStorage.setItem('attendapp_token', token);
    localStorage.setItem('attendapp_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('attendapp_token');
    localStorage.removeItem('attendapp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
