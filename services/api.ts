import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base API configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication
export const authService = {
  login: async (emailOrUsername: string, password: string) => {
    try {
      const response = await api.post('/auth/signin', {
        username_or_email: emailOrUsername,
        password: password,
        session_required: 170
      });
      
      if (response.data.token) {
        await SecureStore.setItemAsync('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  isAuthenticated: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      return !!token;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }
};

// IoT Connections
export const iotService = {
  getAllConnections: async () => {
    try {
      const response = await api.get('/services/IotConnect/getAllIoTConnections');
      return response.data;
    } catch (error) {
      console.error('Get all connections error:', error);
      throw error;
    }
  },
  
  getConnectionById: async (connectionId: string) => {
    try {
      const response = await api.get(`/services/IotConnect/getConnectionById/${connectionId}`);
      return response.data;
    } catch (error) {
      console.error(`Get connection by ID error (${connectionId}):`, error);
      throw error;
    }
  }
};

export default api;