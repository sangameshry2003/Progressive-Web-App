import type { User, LoginForm, SignupForm } from '../types';

// Simulated authentication service
// In a real application, this would integrate with a backend API

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private users: User[] = [
    {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date('2024-01-01'),
      subscription: 'pro'
    }
  ];

  private currentToken: string | null = null;

  constructor() {
    // Load persisted auth state
    this.loadAuthState();
  }

  async login(credentials: LoginForm): Promise<AuthResponse> {
    await this.simulateDelay(1000);

    // Demo credentials
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      const user = this.users.find(u => u.email === credentials.email)!;
      const token = this.generateToken(user.id);
      
      this.currentToken = token;
      this.saveAuthState(user, token);
      
      return {
        success: true,
        user,
        token
      };
    }

    // Simulate other users
    const user = this.users.find(u => u.email === credentials.email);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // For demo purposes, accept any password for existing users
    const token = this.generateToken(user.id);
    this.currentToken = token;
    this.saveAuthState(user, token);

    return {
      success: true,
      user,
      token
    };
  }

  async signup(userData: SignupForm): Promise<AuthResponse> {
    await this.simulateDelay(1200);

    // Validate passwords match
    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }

    // Check if user already exists
    if (this.users.find(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'User already exists'
      };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
      subscription: 'free'
    };

    this.users.push(newUser);
    const token = this.generateToken(newUser.id);
    this.currentToken = token;
    this.saveAuthState(newUser, token);

    return {
      success: true,
      user: newUser,
      token
    };
  }

  async logout(): Promise<void> {
    this.currentToken = null;
    this.clearAuthState();
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No user found' };
    }

    const newToken = this.generateToken(currentUser.id);
    this.currentToken = newToken;
    this.saveAuthState(currentUser, newToken);

    return {
      success: true,
      user: currentUser,
      token: newToken
    };
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    await this.simulateDelay(800);

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    const updatedUser = this.users[userIndex];
    
    this.saveAuthState(updatedUser, this.currentToken!);

    return {
      success: true,
      user: updatedUser
    };
  }

  isAuthenticated(): boolean {
    return !!this.currentToken && !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return this.currentToken || localStorage.getItem('auth_token');
  }

  private generateToken(userId: string): string {
    return `token_${userId}_${Date.now()}`;
  }

  private saveAuthState(user: User, token: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  private clearAuthState(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  private loadAuthState(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.currentToken = token;
    }
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();
