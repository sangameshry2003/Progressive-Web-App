import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { usePWAStore } from '../store/pwaStore';
import { useAuthStore } from '../store/authStore';
import DeploymentManager from './DeploymentManager';
import SaveProjectModal from './SaveProjectModal';
import type { PWATemplate, ThemeOptions } from '../types';

interface PWAGeneratorProps {
  template: PWATemplate;
  formData: Record<string, any>;
  theme: ThemeOptions;
  onReset: () => void;
}

const PWAGenerator: React.FC<PWAGeneratorProps> = ({ template, formData, theme, onReset }) => {
  const { generatedPWAs } = usePWAStore();
  const { isAuthenticated } = useAuthStore();
  const [showDeployment, setShowDeployment] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const currentPWA = generatedPWAs[generatedPWAs.length - 1]; // Get the most recent PWA

  const handleDownload = async () => {
    if (!currentPWA) {
      alert('No PWA generated yet. Please generate a PWA first.');
      return;
    }

    try {
      // Import JSZip dynamically to avoid bundle size issues
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all generated files to the ZIP
      currentPWA.files.forEach(file => {
        if (file.type === 'image' && file.blob) {
          // Add image files as blobs
          zip.file(file.path, file.blob);
        } else {
          // Add text files as strings
          zip.file(file.path, file.content);
        }
      });

      // Generate and download the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-pwa.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating download:', error);
      alert('Error creating download. Please try again.');
    }
  };
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your PWA is Ready!
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your Progressive Web App has been generated successfully. 
          Download the files or deploy directly to start using your new PWA.
        </p>
      </div>

      {/* Success Animation */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8">
        <div className="animate-bounce-in">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🎉 Generation Complete!
          </h3>
          <p className="text-gray-600 mb-6">
            Your <strong>{template.name}</strong> PWA has been created with all your custom content.
          </p>
          
          {/* File List Preview */}
          <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-medium text-gray-900 mb-3">Generated Files:</h4>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>index.html</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>styles.css</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>app.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>manifest.json</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>service-worker.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>+ icon files</span>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PWA Files</span>
        </button>

        {isAuthenticated && (
          <button
            onClick={() => setShowSaveModal(true)}
            className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Project</span>
          </button>
        )}

        <button
          onClick={() => setShowDeployment(true)}
          className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Deploy to Web</span>
        </button>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-xl shadow-sm border p-6 text-left">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Test Your PWA</h4>
            <p className="text-sm text-gray-600">
              Open the downloaded files in a web browser to test functionality and mobile responsiveness.
            </p>
          </div>
          
          <div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 font-semibold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Customize Further</h4>
            <p className="text-sm text-gray-600">
              Edit the generated files to add custom styling, features, or integrate with your existing systems.
            </p>
          </div>
          
          <div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 font-semibold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Deploy & Share</h4>
            <p className="text-sm text-gray-600">
              Upload to your web hosting service and share your PWA URL with users for installation.
            </p>
          </div>
        </div>
      </div>      {/* Reset Button */}
      <div className="mt-8">
        <button
          onClick={onReset}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Create Another PWA
        </button>
      </div>

      {/* Modals */}
      {showDeployment && currentPWA && (
        <DeploymentManager
          pwa={currentPWA}
          onClose={() => setShowDeployment(false)}
        />
      )}

      {showSaveModal && (
        <SaveProjectModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          template={template}
          formData={formData}
          theme={theme}
          config={currentPWA?.config}
          generatedPWA={currentPWA}
        />
      )}
    </div>
  );
};

export default PWAGenerator;
