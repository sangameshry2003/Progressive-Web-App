import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

interface HeaderProps {
  onOpenProjects: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenProjects }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PWA Generator</h1>
                <p className="text-sm text-gray-600">Create Progressive Web Apps with ease</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Templates
                </a>
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#help" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Help
                </a>
              </nav>
              
              {isAuthenticated && user ? (
                <UserMenu onOpenProjects={onOpenProjects} />
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  <button 
                    onClick={() => handleAuthClick('signup')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              {isAuthenticated && user ? (
                <UserMenu onOpenProjects={onOpenProjects} />
              ) : (
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogIn className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default Header;
