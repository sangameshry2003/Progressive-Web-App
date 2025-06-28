import { create } from 'zustand';
import type { User, AuthState, LoginForm, SignupForm } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginForm) => Promise<boolean>;
  signup: (userData: SignupForm) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials: LoginForm) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({
          error: response.error || 'Login failed',
          isLoading: false
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      });
      return false;
    }
  },

  signup: async (userData: SignupForm) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.signup(userData);
      
      if (response.success && response.user) {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({
          error: response.error || 'Signup failed',
          isLoading: false
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        isLoading: false
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const user = await authService.getCurrentUser();
      
      if (user && authService.isAuthenticated()) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Auth check failed'
      });
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return false;

    set({ isLoading: true, error: null });

    try {
      const response = await authService.updateProfile(user.id, updates);
      
      if (response.success && response.user) {
        set({
          user: response.user,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({
          error: response.error || 'Profile update failed',
          isLoading: false
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Profile update failed',
        isLoading: false
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
