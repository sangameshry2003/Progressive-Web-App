import type { SavedProject, ProjectFilters, PWATemplate, PWAConfig, GeneratedPWA, ThemeOptions } from '../types';

// Simulated project management service
// In a real application, this would integrate with a backend API

class ProjectService {
  private projects: SavedProject[] = [];
  private storageKey = 'saved_projects';

  constructor() {
    this.loadProjectsFromStorage();
  }

  async saveProject(
    userId: string,
    name: string,
    template: PWATemplate,
    formData: Record<string, any>,
    theme: ThemeOptions,
    options: {
      description?: string;
      isPublic?: boolean;
      tags?: string[];
      config?: PWAConfig;
      generatedPWA?: GeneratedPWA;
    } = {}
  ): Promise<SavedProject> {
    await this.simulateDelay(800);

    const project: SavedProject = {
      id: Date.now().toString(),
      userId,
      name,
      description: options.description || '',
      template,
      formData,
      theme,
      config: options.config,
      generatedPWA: options.generatedPWA,
      isPublic: options.isPublic || false,
      tags: options.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastGeneratedAt: options.generatedPWA ? new Date() : undefined
    };

    this.projects.push(project);
    this.saveProjectsToStorage();
    
    return project;
  }

  async updateProject(
    projectId: string,
    updates: Partial<SavedProject>
  ): Promise<SavedProject | null> {
    await this.simulateDelay(600);

    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const updatedProject = {
      ...this.projects[projectIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.projects[projectIndex] = updatedProject;
    this.saveProjectsToStorage();
    
    return updatedProject;
  }

  async deleteProject(projectId: string, userId: string): Promise<boolean> {
    await this.simulateDelay(400);

    const projectIndex = this.projects.findIndex(
      p => p.id === projectId && p.userId === userId
    );
    
    if (projectIndex === -1) {
      throw new Error('Project not found or access denied');
    }

    this.projects.splice(projectIndex, 1);
    this.saveProjectsToStorage();
    
    return true;
  }

  async getProject(projectId: string, userId?: string): Promise<SavedProject | null> {
    await this.simulateDelay(300);

    const project = this.projects.find(p => p.id === projectId);
    
    if (!project) {
      return null;
    }

    // If no userId provided, only return public projects
    if (!userId && !project.isPublic) {
      return null;
    }

    // If userId provided, return project if user owns it or it's public
    if (userId && project.userId !== userId && !project.isPublic) {
      return null;
    }

    return project;
  }

  async getUserProjects(
    userId: string,
    filters: ProjectFilters = { sortBy: 'updatedAt', sortOrder: 'desc' }
  ): Promise<SavedProject[]> {
    await this.simulateDelay(500);

    let userProjects = this.projects.filter(p => p.userId === userId);

    // Apply filters
    if (filters.category) {
      userProjects = userProjects.filter(p => p.template.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      userProjects = userProjects.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    userProjects.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return filters.sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    return userProjects;
  }

  async getPublicProjects(
    filters: ProjectFilters = { sortBy: 'updatedAt', sortOrder: 'desc' }
  ): Promise<SavedProject[]> {
    await this.simulateDelay(600);

    let publicProjects = this.projects.filter(p => p.isPublic);

    // Apply same filtering logic as getUserProjects
    if (filters.category) {
      publicProjects = publicProjects.filter(p => p.template.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      publicProjects = publicProjects.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    publicProjects.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return filters.sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    return publicProjects;
  }

  async duplicateProject(
    projectId: string,
    userId: string,
    newName: string
  ): Promise<SavedProject> {
    await this.simulateDelay(700);

    const originalProject = await this.getProject(projectId, userId);
    if (!originalProject) {
      throw new Error('Project not found or access denied');
    }

    const duplicatedProject: SavedProject = {
      ...originalProject,
      id: Date.now().toString(),
      userId,
      name: newName,
      isPublic: false, // Duplicated projects are private by default
      createdAt: new Date(),
      updatedAt: new Date(),
      lastGeneratedAt: undefined, // Reset generation status
      generatedPWA: undefined
    };

    this.projects.push(duplicatedProject);
    this.saveProjectsToStorage();

    return duplicatedProject;
  }

  async getProjectStats(userId: string): Promise<{
    totalProjects: number;
    publicProjects: number;
    generatedProjects: number;
    categoryCounts: Record<string, number>;
  }> {
    await this.simulateDelay(200);

    const userProjects = this.projects.filter(p => p.userId === userId);
    
    const stats = {
      totalProjects: userProjects.length,
      publicProjects: userProjects.filter(p => p.isPublic).length,
      generatedProjects: userProjects.filter(p => p.generatedPWA).length,
      categoryCounts: {} as Record<string, number>
    };

    // Count projects by category
    userProjects.forEach(project => {
      const category = project.template.category;
      stats.categoryCounts[category] = (stats.categoryCounts[category] || 0) + 1;
    });

    return stats;
  }

  private saveProjectsToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
    } catch (error) {
      console.warn('Failed to save projects to localStorage:', error);
    }
  }

  private loadProjectsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.projects = parsed.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
          lastGeneratedAt: project.lastGeneratedAt ? new Date(project.lastGeneratedAt) : undefined
        }));
      }
    } catch (error) {
      console.warn('Failed to load projects from localStorage:', error);
      this.projects = [];
    }
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const projectService = new ProjectService();
