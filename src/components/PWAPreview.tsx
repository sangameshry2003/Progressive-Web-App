import React, { useState } from 'react';
import ThemeCustomizer from './ThemeCustomizer';
import type { PWATemplate, ThemeOptions } from '../types';

interface PWAPreviewProps {
  template: PWATemplate;
  formData: Record<string, any>;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
  theme?: ThemeOptions;
  onThemeChange?: (theme: ThemeOptions) => void;
}

const PWAPreview: React.FC<PWAPreviewProps> = ({ 
  template, 
  formData, 
  onGenerate, 
  onBack, 
  isGenerating,
  theme,
  onThemeChange
}) => {
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  
  const defaultTheme: ThemeOptions = {
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    borderRadius: '8px'
  };

  const currentTheme = theme || defaultTheme;
  const renderPreview = () => {
    switch (template.id) {
      case 'business-card':
        return (          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <div className="text-center">
              {formData.logo && (formData.logo.preview || formData.logo.base64) ? (
                <div className="w-16 h-16 mx-auto mb-4">
                  <img 
                    src={formData.logo.base64 || formData.logo.preview} 
                    alt="Business Logo" 
                    className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                  />
                </div>
              ) : formData.logo ? (
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
              ) : null}
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {formData.businessName || 'Business Name'}
              </h2>
              {formData.tagline && (
                <p className="text-sm text-gray-600 mb-4">{formData.tagline}</p>
              )}
              <div className="space-y-2 text-sm">
                <p className="font-medium">{formData.ownerName || 'Owner Name'}</p>
                <p className="text-blue-600">{formData.email || 'email@example.com'}</p>
                <p>{formData.phone || '+1 (555) 123-4567'}</p>
                {formData.website && (
                  <p className="text-blue-600">{formData.website}</p>
                )}
                {formData.address && (
                  <p className="text-gray-600 text-xs">{formData.address}</p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'portfolio':
        return (          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
              {formData.profileImage && (formData.profileImage.preview || formData.profileImage.base64) ? (
                <div className="w-20 h-20 mx-auto mb-4">
                  <img 
                    src={formData.profileImage.base64 || formData.profileImage.preview} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full border-2 border-white border-opacity-50"
                  />
                </div>
              ) : formData.profileImage ? (
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xs">Photo</span>
                </div>
              ) : null}
              <h2 className="text-xl font-bold mb-1">
                {formData.name || 'Your Name'}
              </h2>
              <p className="text-blue-100">
                {formData.title || 'Professional Title'}
              </p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                {formData.bio || 'Your professional bio will appear here...'}
              </p>
              {formData.skills && formData.skills.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.slice(0, 6).map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {formData.skills.length > 6 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{formData.skills.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'restaurant-menu':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-red-600 p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-1">
                {formData.restaurantName || 'Restaurant Name'}
              </h2>
              <p className="text-red-100">
                {formData.cuisine || 'Cuisine Type'}
              </p>
            </div>
            <div className="p-6">
              {formData.description && (
                <p className="text-gray-600 text-sm mb-4">{formData.description}</p>
              )}
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-gray-600">{formData.address || 'Address'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Contact</h3>
                  <p className="text-gray-600">{formData.phone || 'Phone'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Hours</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {formData.hours || 'Operating hours'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'event-landing':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-2">
                {formData.eventName || 'Event Name'}
              </h2>
              <div className="text-green-100 space-y-1">
                <p>{formData.eventDate || 'Event Date'}</p>
                <p>{formData.eventTime || 'Event Time'}</p>
                <p>{formData.venue || 'Venue'}</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                {formData.description || 'Event description will appear here...'}
              </p>
              {formData.speakers && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">Featured Speakers</h3>
                  <p className="text-gray-600 text-sm">{formData.speakers}</p>
                </div>
              )}
              {formData.ticketPrice && (
                <div className="text-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {formData.ticketPrice}
                  </span>
                </div>
              )}            </div>
          </div>
        );

      case 'e-commerce':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-blue-600 p-4 text-white text-center">
              {formData.storeLogo && (formData.storeLogo.preview || formData.storeLogo.base64) ? (
                <div className="w-16 h-16 mx-auto mb-2">
                  <img 
                    src={formData.storeLogo.base64 || formData.storeLogo.preview} 
                    alt="Store Logo" 
                    className="w-full h-full object-cover rounded-lg border border-white border-opacity-50"
                  />
                </div>
              ) : null}
              <h2 className="text-xl font-bold">{formData.storeName || 'Online Store'}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                {formData.storeDescription || 'Store description will appear here...'}
              </p>
              {formData.productCategories && formData.productCategories.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-1">
                    {formData.productCategories.map((category: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-600">
                <p><strong>Currency:</strong> {formData.currency || 'USD'}</p>
                <p><strong>Contact:</strong> {formData.contactEmail || 'support@store.com'}</p>
              </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white text-center">
              {formData.authorPhoto && (formData.authorPhoto.preview || formData.authorPhoto.base64) ? (
                <div className="w-16 h-16 mx-auto mb-3">
                  <img 
                    src={formData.authorPhoto.base64 || formData.authorPhoto.preview} 
                    alt="Author Photo" 
                    className="w-full h-full object-cover rounded-full border-2 border-white border-opacity-50"
                  />
                </div>
              ) : null}
              <h2 className="text-xl font-bold mb-1">{formData.blogTitle || 'My Blog'}</h2>
              {formData.blogSubtitle && (
                <p className="text-green-100 text-sm">{formData.blogSubtitle}</p>
              )}
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">{formData.authorName || 'Blog Author'}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {formData.authorBio || 'Author bio will appear here...'}
                </p>
              </div>
              {formData.blogCategories && formData.blogCategories.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.blogCategories.map((category: string, index: number) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {formData.socialMedia && (
                <p className="text-gray-500 text-xs">{formData.socialMedia}</p>
              )}
            </div>
          </div>
        );

      case 'landing-page':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
              {formData.productImage && (formData.productImage.preview || formData.productImage.base64) ? (
                <div className="w-20 h-20 mx-auto mb-3">
                  <img 
                    src={formData.productImage.base64 || formData.productImage.preview} 
                    alt="Product" 
                    className="w-full h-full object-cover rounded-lg border-2 border-white border-opacity-50"
                  />
                </div>
              ) : null}
              <h1 className="text-lg font-bold mb-1">{formData.headline || 'Amazing Product'}</h1>
              {formData.subheadline && (
                <p className="text-orange-100 text-sm">{formData.subheadline}</p>
              )}
            </div>
            <div className="p-6 text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                {formData.productName || 'Product Name'}
              </h2>
              {formData.features && formData.features.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap justify-center gap-1">
                    {formData.features.map((feature: string, index: number) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-4">
                <p className="text-xl font-bold text-gray-900">{formData.pricing || 'Contact for Pricing'}</p>
              </div>
              <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium">
                {formData.ctaText || 'Get Started'}
              </button>
              <p className="text-gray-500 text-sm mt-3">{formData.contactEmail || 'contact@product.com'}</p>
            </div>
          </div>
        );

      case 'nonprofit':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center">
              {formData.organizationLogo && (formData.organizationLogo.preview || formData.organizationLogo.base64) ? (
                <div className="w-16 h-16 mx-auto mb-3">
                  <img 
                    src={formData.organizationLogo.base64 || formData.organizationLogo.preview} 
                    alt="Organization Logo" 
                    className="w-full h-full object-cover rounded-lg border-2 border-white border-opacity-50"
                  />
                </div>
              ) : null}
              <h2 className="text-xl font-bold">{formData.organizationName || 'Non-Profit Organization'}</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-1">Mission</h3>
                <p className="text-gray-600 text-sm">
                  {formData.mission || 'Our mission statement will appear here...'}
                </p>
              </div>
              {formData.causes && formData.causes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.causes.map((cause: string, index: number) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {cause}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {formData.impactNumbers && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">Our Impact</h4>
                  <p className="text-gray-600 text-sm">{formData.impactNumbers}</p>
                </div>
              )}
              {formData.donationGoal && (
                <div className="text-center mb-4">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Goal: {formData.donationGoal}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                <p>{formData.contactInfo || 'Contact information will appear here...'}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Ready</h3>
            <p className="text-gray-600">Your PWA will be generated based on the template and data provided.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Form
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Preview Your PWA
        </h2>
        <p className="text-lg text-gray-600">
          Review how your PWA will look on mobile devices before generating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mobile Preview */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Preview</h3>
          <div className="bg-gray-100 rounded-2xl p-4">
            <div className="bg-black rounded-2xl p-1">
              <div className="bg-white rounded-xl overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
                <div className="h-full overflow-y-auto p-4">
                  {renderPreview()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Features & Info */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">PWA Features</h3>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Offline Capability</h4>
                  <p className="text-sm text-gray-600">Works without internet connection</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">App-like Experience</h4>
                  <p className="text-sm text-gray-600">Install on device home screen</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Engage users with notifications</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Responsive Design</h4>
                  <p className="text-sm text-gray-600">Optimized for all devices</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Template Features</h4>
              <div className="flex flex-wrap gap-2">
                {template.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>          <div className="mt-6 flex space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={() => setIsThemeCustomizerOpen(true)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
              </svg>
              Customize Theme
            </button>
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate PWA'
              )}            </button>
          </div>
        </div>
      </div>

      {/* Theme Customizer Modal */}
      <ThemeCustomizer
        theme={currentTheme}
        onThemeChange={(newTheme) => {
          if (onThemeChange) {
            onThemeChange(newTheme);
          }
        }}
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
      />
    </div>
  );
};

export default PWAPreview;
