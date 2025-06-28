import React, { useState } from 'react';

interface ThemeOptions {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
}

interface ThemeCustomizerProps {
  theme: ThemeOptions;
  onThemeChange: (theme: ThemeOptions) => void;
  isOpen: boolean;
  onClose: () => void;
}

const defaultThemes = [
  {
    name: 'Modern Blue',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    borderRadius: '8px'
  },
  {
    name: 'Vibrant Green',
    primaryColor: '#10b981',
    secondaryColor: '#34d399',
    backgroundColor: '#f9fafb',
    textColor: '#111827',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    borderRadius: '12px'
  },
  {
    name: 'Elegant Purple',
    primaryColor: '#8b5cf6',
    secondaryColor: '#a78bfa',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
    borderRadius: '6px'
  },
  {
    name: 'Warm Orange',
    primaryColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    backgroundColor: '#fffbeb',
    textColor: '#1f2937',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '15px',
    borderRadius: '10px'
  }
];

const fontOptions = [
  { label: 'Inter (Modern)', value: 'Inter, sans-serif' },
  { label: 'Roboto (Clean)', value: 'Roboto, sans-serif' },
  { label: 'Open Sans (Friendly)', value: 'Open Sans, sans-serif' },
  { label: 'Poppins (Rounded)', value: 'Poppins, sans-serif' },
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Times (Classic)', value: 'Times New Roman, serif' },
  { label: 'Courier (Mono)', value: 'Courier New, monospace' }
];

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ 
  theme, 
  onThemeChange, 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'typography'>('presets');

  if (!isOpen) return null;

  const handlePresetSelect = (preset: ThemeOptions) => {
    onThemeChange(preset);
  };

  const handleColorChange = (field: keyof ThemeOptions, value: string) => {
    onThemeChange({ ...theme, [field]: value });
  };

  const ColorPicker = ({ label, value, onChange }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Customize Theme</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {[
                { id: 'presets', label: 'Theme Presets', icon: '🎨' },
                { id: 'colors', label: 'Colors', icon: '🌈' },
                { id: 'typography', label: 'Typography', icon: '📝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'presets' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Preset Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {defaultThemes.map((preset) => (
                      <div
                        key={preset.name}
                        onClick={() => handlePresetSelect(preset)}
                        className="cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                        style={{
                          background: `linear-gradient(135deg, ${preset.primaryColor}20, ${preset.secondaryColor}20)`
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.primaryColor }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.secondaryColor }}
                          />
                        </div>
                        <h4 className="font-medium text-gray-900">{preset.name}</h4>
                        <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: preset.fontFamily }}>
                          Sample text in {preset.fontFamily.split(',')[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ColorPicker
                        label="Primary Color"
                        value={theme.primaryColor}
                        onChange={(value) => handleColorChange('primaryColor', value)}
                      />
                      <ColorPicker
                        label="Secondary Color"
                        value={theme.secondaryColor}
                        onChange={(value) => handleColorChange('secondaryColor', value)}
                      />
                    </div>
                    <div>
                      <ColorPicker
                        label="Background Color"
                        value={theme.backgroundColor}
                        onChange={(value) => handleColorChange('backgroundColor', value)}
                      />
                      <ColorPicker
                        label="Text Color"
                        value={theme.textColor}
                        onChange={(value) => handleColorChange('textColor', value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'typography' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                      <select
                        value={theme.fontFamily}
                        onChange={(e) => handleColorChange('fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {fontOptions.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size: {theme.fontSize}
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="20"
                        value={parseInt(theme.fontSize)}
                        onChange={(e) => handleColorChange('fontSize', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Border Radius: {theme.borderRadius}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={parseInt(theme.borderRadius)}
                        onChange={(e) => handleColorChange('borderRadius', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>

                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                      <div
                        style={{
                          fontFamily: theme.fontFamily,
                          fontSize: theme.fontSize,
                          color: theme.textColor,
                          backgroundColor: theme.backgroundColor,
                          borderRadius: theme.borderRadius,
                          padding: '16px'
                        }}
                      >
                        <h3 style={{ color: theme.primaryColor, marginBottom: '8px' }}>
                          Sample Heading
                        </h3>
                        <p>This is how your text will appear with the selected typography settings.</p>
                        <button
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: theme.backgroundColor,
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: theme.borderRadius,
                            marginTop: '8px',
                            fontFamily: theme.fontFamily
                          }}
                        >
                          Sample Button
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
