// src/api/axiosSetup.js
import api from './axios';
// import jwt_decode from 'jwt-decode';

export const setupInterceptors = (getAccessToken, setAccessToken, logout) => {
  api.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    r => r,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await api.post('/auth/refresh');
          setAccessToken(res.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        } catch (e) {
          logout();
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
  );
};
