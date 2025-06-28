export interface PWATemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'portfolio' | 'e-commerce' | 'blog' | 'utility';
  thumbnail: string;
  features: string[];
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'url' | 'tel' | 'color' | 'image' | 'select' | 'multiselect';
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface PWAConfig {
  templateId: string;
  appName: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  icon: string;
  customData: Record<string, any>;
  theme?: ThemeOptions;
}

export interface ThemeOptions {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
}

export interface GeneratedPWA {
  id: string;
  config: PWAConfig;
  files: GeneratedFile[];
  downloadUrl?: string;
  createdAt: Date;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json' | 'manifest' | 'sw' | 'image';
  blob?: Blob;
}

// User Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  subscription?: 'free' | 'pro' | 'enterprise';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Project Management Types
export interface SavedProject {
  id: string;
  userId: string;
  name: string;
  description?: string;
  template: PWATemplate;
  formData: Record<string, any>;
  theme: ThemeOptions;
  config?: PWAConfig;
  generatedPWA?: GeneratedPWA;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastGeneratedAt?: Date;
}

export interface ProjectFilters {
  category?: string;
  search?: string;
  sortBy: 'updatedAt' | 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
  showPublic?: boolean;
}

// Authentication Forms
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
