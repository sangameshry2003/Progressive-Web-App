import React, { useState } from 'react';
import { deploymentProviders, deploymentService } from '../services/deploymentService';
import type { DeploymentConfig, DeploymentResult, DeploymentProvider } from '../services/deploymentService';
import type { GeneratedPWA } from '../types';

interface DeploymentManagerProps {
  pwa: GeneratedPWA;
  onClose: () => void;
}

const DeploymentManager: React.FC<DeploymentManagerProps> = ({ pwa, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<DeploymentProvider | null>(null);
  const [config, setConfig] = useState<DeploymentConfig>({
    provider: '',
    siteName: '',
    publishDirectory: '/',
    customDomain: '',
    environmentVariables: {}
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<DeploymentResult | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleProviderSelect = (provider: DeploymentProvider) => {
    setSelectedProvider(provider);
    setConfig(prev => ({ ...prev, provider: provider.id }));
    setDeployResult(null);
    setErrors([]);
  };

  const handleConfigChange = (field: keyof DeploymentConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleDeploy = async () => {
    if (!selectedProvider) return;

    // Validate configuration
    const validation = await deploymentService.validateConfig(selectedProvider.id, config);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsDeploying(true);
    setErrors([]);

    try {
      const result = await deploymentService.deploy(selectedProvider.id, config, pwa.files);
      setDeployResult(result);
    } catch (error) {
      setDeployResult({
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const ProviderCard = ({ provider }: { provider: DeploymentProvider }) => (
    <div
      onClick={() => handleProviderSelect(provider)}
      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
        selectedProvider?.id === provider.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{provider.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
          <div className="flex flex-wrap gap-1">
            {provider.supportedFeatures.slice(0, 2).map((feature) => (
              <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {feature}
              </span>
            ))}
            {provider.supportedFeatures.length > 2 && (
              <span className="text-gray-500 text-xs">+{provider.supportedFeatures.length - 2} more</span>
            )}
          </div>
          {provider.requiresAuth && (
            <div className="mt-2 flex items-center text-yellow-600 text-xs">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Requires authentication
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Deploy Your PWA</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedProvider && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Deployment Provider</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deploymentProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </div>
          )}

          {selectedProvider && !deployResult && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ← Back to providers
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{selectedProvider.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedProvider.name}</h3>
                </div>
              </div>

              <div className="space-y-6">
                {/* Configuration Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={config.siteName}
                      onChange={(e) => handleConfigChange('siteName', e.target.value)}
                      placeholder="my-awesome-pwa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your site will be available at {config.siteName || 'sitename'}.{selectedProvider.id === 'netlify' ? 'netlify.app' : selectedProvider.id === 'vercel' ? 'vercel.app' : selectedProvider.id === 'surge' ? 'surge.sh' : 'example.com'}
                    </p>
                  </div>

                  {selectedProvider.id === 'surge' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Domain (Optional)
                      </label>
                      <input
                        type="text"
                        value={config.customDomain}
                        onChange={(e) => handleConfigChange('customDomain', e.target.value)}
                        placeholder="example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
                    <ul className="list-disc list-inside text-red-700 text-sm">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions Toggle */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-blue-800 font-medium">Deployment Instructions</h4>
                    <button
                      onClick={() => setShowInstructions(!showInstructions)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {showInstructions ? 'Hide' : 'Show'} instructions
                    </button>
                  </div>
                  {showInstructions && (
                    <div className="mt-3">
                      <ol className="list-decimal list-inside text-blue-700 text-sm space-y-1">
                        {deploymentService.generateDeployInstructions(selectedProvider.id, config).map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  {selectedProvider.requiresAuth ? (
                    <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Authentication Required</span>
                      </div>
                      <p className="text-yellow-700 text-sm mb-3">
                        This provider requires authentication. You'll need to connect your account or use their CLI tools.
                      </p>
                      <button
                        onClick={handleDeploy}
                        disabled={isDeploying || !config.siteName}
                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                      >
                        {isDeploying ? 'Simulating Deployment...' : 'Simulate Deployment'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleDeploy}
                      disabled={isDeploying || !config.siteName}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {isDeploying ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deploying...
                        </>
                      ) : (
                        'Deploy Now'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {deployResult && (
            <div>
              <div className="text-center mb-6">
                {deployResult.success ? (
                  <div className="text-green-600">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Deployment Successful!</h3>
                    <p className="text-gray-600">Your PWA has been deployed and is now live.</p>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Deployment Failed</h3>
                    <p className="text-gray-600 mb-4">{deployResult.error}</p>
                  </div>
                )}
              </div>

              {deployResult.success && deployResult.url && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h4 className="text-green-800 font-medium mb-2">Your PWA is live!</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-700 text-sm font-medium">Live URL: </span>
                      <a 
                        href={deployResult.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {deployResult.url}
                      </a>
                    </div>
                    {deployResult.previewUrl && deployResult.previewUrl !== deployResult.url && (
                      <div>
                        <span className="text-green-700 text-sm font-medium">Preview URL: </span>
                        <a 
                          href={deployResult.previewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          {deployResult.previewUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {deployResult.logs && deployResult.logs.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="text-gray-800 font-medium mb-2">Deployment Logs</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {deployResult.logs.map((log, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    setDeployResult(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Deploy to Another Provider
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentManager;
