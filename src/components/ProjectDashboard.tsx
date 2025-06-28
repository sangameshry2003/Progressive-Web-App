import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Search, Grid, List, Edit3, 
  Trash2, Copy, Eye,
  Folder, Clock, Globe, Lock
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import type { SavedProject, ProjectFilters } from '../types';

interface ProjectDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (project: SavedProject) => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  isOpen, 
  onClose, 
  onLoadProject 
}) => {
  const { user } = useAuthStore();
  const {
    projects,
    publicProjects,
    filters,
    isLoading,
    error,
    stats,
    loadUserProjects,
    loadPublicProjects,
    deleteProject,
    duplicateProject,
    setFilters,
    loadStats,
    clearError
  } = useProjectStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'my-projects' | 'public'>('my-projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadUserProjects(user.id);
      loadPublicProjects();
      loadStats(user.id);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (user) {
      const newFilters: ProjectFilters = {
        ...filters,
        search: searchQuery || undefined,
        category: selectedCategory || undefined
      };
      
      if (activeTab === 'my-projects') {
        loadUserProjects(user.id, newFilters);
      } else {
        loadPublicProjects(newFilters);
      }
    }
  }, [searchQuery, selectedCategory, filters.sortBy, filters.sortOrder, activeTab]);

  const handleDeleteProject = async (projectId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId, user.id);
    }
  };

  const handleDuplicateProject = async (project: SavedProject) => {
    if (!user) return;
    
    const newName = prompt('Enter a name for the duplicated project:', `${project.name} (Copy)`);
    if (newName) {
      await duplicateProject(project.id, user.id, newName);    }
  };

  const currentProjects = activeTab === 'my-projects' ? projects : publicProjects;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'my-projects' ? 'My Projects' : 'Public Projects'}
            </h2>
            {stats && activeTab === 'my-projects' && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{stats.totalProjects} total</span>
                <span>{stats.generatedProjects} generated</span>
                <span>{stats.publicProjects} public</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('my-projects')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'my-projects'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'public'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Public Projects
            </button>
          </nav>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="business">Business</option>
                <option value="portfolio">Portfolio</option>
                <option value="e-commerce">E-commerce</option>
                <option value="blog">Blog</option>
                <option value="utility">Utility</option>
              </select>

              {/* Sort */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({ 
                    sortBy: sortBy as 'updatedAt' | 'createdAt' | 'name',
                    sortOrder: sortOrder as 'asc' | 'desc'
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updatedAt-desc">Recently Updated</option>
                <option value="createdAt-desc">Recently Created</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : currentProjects.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'my-projects' ? 'No projects yet' : 'No public projects found'}
              </h3>
              <p className="text-gray-600">
                {activeTab === 'my-projects' 
                  ? 'Create your first PWA project to get started!'
                  : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {currentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  isOwner={activeTab === 'my-projects'}
                  onLoad={() => onLoadProject(project)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onDuplicate={() => handleDuplicateProject(project)}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface ProjectCardProps {
  project: SavedProject;
  viewMode: 'grid' | 'list';
  isOwner: boolean;
  onLoad: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  viewMode,
  isOwner,
  onLoad,
  onDelete,
  onDuplicate
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      business: '💼',
      portfolio: '👤',
      'e-commerce': '🛒',
      blog: '📝',
      utility: '🔧'
    };
    return icons[category as keyof typeof icons] || '📄';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-2xl">{getCategoryIcon(project.template.category)}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {project.template.name}
                </span>
                {project.isPublic ? (
                  <Globe className="w-4 h-4 text-green-600" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>Updated {format(project.updatedAt, 'MMM d, yyyy')}</span>
                {project.lastGeneratedAt && (
                  <span>Generated {format(project.lastGeneratedAt, 'MMM d, yyyy')}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onLoad}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Load project"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDuplicate}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            {isOwner && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getCategoryIcon(project.template.category)}</span>
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-1">{project.name}</h3>
              <span className="text-xs text-gray-600">{project.template.name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {project.isPublic ? (
              <Globe className="w-4 h-4 text-green-600" />
            ) : (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description || 'No description'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Updated {format(project.updatedAt, 'MMM d')}</span>
          </div>
          {project.lastGeneratedAt && (
            <div className="flex items-center space-x-1 text-green-600">
              <Eye className="w-3 h-3" />
              <span>Generated</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onLoad}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors mr-2"
          >
            Load Project
          </button>
          <div className="flex items-center space-x-1">
            <button
              onClick={onDuplicate}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            {isOwner && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
