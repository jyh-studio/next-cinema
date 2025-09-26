import { User } from '@/types';
import { authApi } from './api';
import { authStore } from './authStore';

const AUTH_KEY = 'nextcinema_auth';
const USER_KEY = 'nextcinema_user';

export const authUtils = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const tokenData = await authApi.login(email, password);
      const userData = await authApi.getCurrentUser();
      
      // Convert backend user format to frontend format
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        isMember: userData.is_member,
        profileCompleted: userData.profile_completed,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Update the auth store
      authStore.setUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  signup: async (email: string, password: string, name: string): Promise<User | null> => {
    try {
      const tokenData = await authApi.signup(email, password, name);
      const userData = await authApi.getCurrentUser();
      
      // Convert backend user format to frontend format
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        isMember: userData.is_member,
        profileCompleted: userData.profile_completed,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Update the auth store
      authStore.setUser(user);
      
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  },

  logout: () => {
    authApi.logout();
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Update the auth store
    authStore.clearUser();
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    const hasToken = localStorage.getItem('nextcinema_token');
    const hasAuth = localStorage.getItem(AUTH_KEY) === 'true';
    return hasToken !== null && hasAuth;
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = authUtils.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      
      // Update the auth store
      authStore.updateUser(updates);
      
      return updatedUser;
    }
    return null;
  },

  // Initialize user data from token if available
  initializeAuth: async (): Promise<User | null> => {
    const token = localStorage.getItem('nextcinema_token');
    if (token) {
      try {
        const userData = await authApi.getCurrentUser();
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          isMember: userData.is_member,
          profileCompleted: userData.profile_completed,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        
        // Update the auth store
        authStore.setUser(user);
        
        return user;
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid token
        authUtils.logout();
        return null;
      }
    }
    return null;
  }
};