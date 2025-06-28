import { create } from 'zustand';
import type { SavedProject, ProjectFilters, PWATemplate, PWAConfig, GeneratedPWA, ThemeOptions } from '../types';
import { projectService } from '../services/projectService';

interface ProjectStore {
  // State
  projects: SavedProject[];
  publicProjects: SavedProject[];
  currentProject: SavedProject | null;
  filters: ProjectFilters;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalProjects: number;
    publicProjects: number;
    generatedProjects: number;
    categoryCounts: Record<string, number>;
  } | null;

  // Actions
  saveProject: (
    userId: string,
    name: string,
    template: PWATemplate,
    formData: Record<string, any>,
    theme: ThemeOptions,
    options?: {
      description?: string;
      isPublic?: boolean;
      tags?: string[];
      config?: PWAConfig;
      generatedPWA?: GeneratedPWA;
    }
  ) => Promise<SavedProject | null>;
  
  updateProject: (projectId: string, updates: Partial<SavedProject>) => Promise<boolean>;
  deleteProject: (projectId: string, userId: string) => Promise<boolean>;
  loadProject: (projectId: string, userId?: string) => Promise<boolean>;
  loadUserProjects: (userId: string, filters?: ProjectFilters) => Promise<void>;
  loadPublicProjects: (filters?: ProjectFilters) => Promise<void>;
  duplicateProject: (projectId: string, userId: string, newName: string) => Promise<SavedProject | null>;
  
  setFilters: (filters: Partial<ProjectFilters>) => void;
  setCurrentProject: (project: SavedProject | null) => void;
  
  loadStats: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  projects: [],
  publicProjects: [],
  currentProject: null,
  filters: {
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  },
  isLoading: false,
  error: null,
  stats: null,

  // Actions
  saveProject: async (userId, name, template, formData, theme, options = {}) => {
    set({ isLoading: true, error: null });

    try {
      const savedProject = await projectService.saveProject(
        userId,
        name,
        template,
        formData,
        theme,
        options
      );

      set((state) => ({
        projects: [savedProject, ...state.projects],
        isLoading: false,
        error: null
      }));

      return savedProject;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save project',
        isLoading: false
      });
      return null;
    }
  },

  updateProject: async (projectId, updates) => {
    set({ isLoading: true, error: null });

    try {
      const updatedProject = await projectService.updateProject(projectId, updates);
      
      if (updatedProject) {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId ? updatedProject : p
          ),
          currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject,
          isLoading: false,
          error: null
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update project',
        isLoading: false
      });
      return false;
    }
  },

  deleteProject: async (projectId, userId) => {
    set({ isLoading: true, error: null });

    try {
      await projectService.deleteProject(projectId, userId);
      
      set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete project',
        isLoading: false
      });
      return false;
    }
  },

  loadProject: async (projectId, userId) => {
    set({ isLoading: true, error: null });

    try {
      const project = await projectService.getProject(projectId, userId);
      
      set({
        currentProject: project,
        isLoading: false,
        error: project ? null : 'Project not found'
      });

      return !!project;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load project',
        isLoading: false,
        currentProject: null
      });
      return false;
    }
  },

  loadUserProjects: async (userId, filters) => {
    set({ isLoading: true, error: null });

    try {
      const currentFilters = filters || get().filters;
      const projects = await projectService.getUserProjects(userId, currentFilters);
      
      set({
        projects,
        filters: currentFilters,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load projects',
        isLoading: false
      });
    }
  },

  loadPublicProjects: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const currentFilters = filters || get().filters;
      const publicProjects = await projectService.getPublicProjects(currentFilters);
      
      set({
        publicProjects,
        filters: currentFilters,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load public projects',
        isLoading: false
      });
    }
  },

  duplicateProject: async (projectId, userId, newName) => {
    set({ isLoading: true, error: null });

    try {
      const duplicatedProject = await projectService.duplicateProject(projectId, userId, newName);
      
      set((state) => ({
        projects: [duplicatedProject, ...state.projects],
        isLoading: false,
        error: null
      }));

      return duplicatedProject;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to duplicate project',
        isLoading: false
      });
      return null;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  loadStats: async (userId) => {
    try {
      const stats = await projectService.getProjectStats(userId);
      set({ stats });
    } catch (error) {
      console.warn('Failed to load project stats:', error);
    }
  },

  clearError: () => set({ error: null })
}));
