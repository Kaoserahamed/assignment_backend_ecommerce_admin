import { create } from 'zustand';
import axios from '../lib/axios';
import { getErrorMessage } from '../lib/errorMessages';

const useAuthStore = create((set) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Fetch session to get permissions
      const sessionResponse = await axios.get('/auth/session');
      const sessionData = sessionResponse.data.data;
      
      set({
        user: sessionData,
        permissions: sessionData.permissions || [],
        isAuthenticated: true,
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Login failed. Please try again'),
      };
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        user: null,
        permissions: [],
        isAuthenticated: false,
      });
    }
  },

  fetchSession: async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await axios.get('/auth/session');
      const sessionData = response.data.data;
      
      set({
        user: sessionData,
        permissions: sessionData.permissions || [],
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        user: null,
        permissions: [],
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  hasPermission: (permission) => {
    const state = useAuthStore.getState();
    return state.permissions.includes(permission);
  },

  hasAnyPermission: (permissionList) => {
    const state = useAuthStore.getState();
    return permissionList.some(permission => state.permissions.includes(permission));
  },
}));

export default useAuthStore;
