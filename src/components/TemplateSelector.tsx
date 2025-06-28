import React from 'react';
import type { PWATemplate } from '../types';

interface TemplateSelectorProps {
  templates: PWATemplate[];
  onSelect: (template: PWATemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelect }) => {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your PWA Template
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our collection of professionally designed templates. 
          Each template is optimized for mobile devices and includes PWA features.
        </p>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 capitalize">
            {category} Templates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter(template => template.category === category)
              .map(template => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => onSelect(template)}
                >
                  {/* Template Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Preview Available</p>
                    </div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Fields Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {template.fields.length} customizable fields
                      </span>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                        <span className="text-sm font-medium mr-1">Select</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Custom Template Option */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-dashed border-blue-200">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Need a Custom Template?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find the perfect template? Contact us to create a custom solution for your needs.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Request Custom Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
