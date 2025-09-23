// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // minimal user info
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await api.post('/auth/refresh'); // cookie sent automatically
      setAccessToken(res.data.accessToken);
      // Optionally decode user from token or request /me
    } catch (err) {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, signup, logout, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
