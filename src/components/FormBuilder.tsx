import React, { useState, useEffect } from 'react';
import type { PWATemplate, FormField } from '../types';

interface FormBuilderProps {
  template: PWATemplate;
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onBack: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ 
  template, 
  initialData, 
  onSubmit, 
  onBack 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [fieldId]: false }));

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        handleInputChange(fieldId, {
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
          base64
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [fieldId]: true }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [fieldId]: false }));
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { minLength, maxLength } = field.validation;
      const valueLength = value?.toString().length || 0;

      if (minLength && valueLength < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }

      if (maxLength && valueLength > maxLength) {
        return `${field.label} must not exceed ${maxLength} characters`;
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        return 'Please enter a valid URL';
      }
    }

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    template.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    const commonProps = {
      id: field.id,
      name: field.id,
      className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
        error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
      }`,
      placeholder: field.placeholder,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleInputChange(field.id, e.target.value)
    };

    return (
      <div key={field.id} className="mb-6">
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === 'textarea' && (
          <textarea
            {...commonProps}
            rows={4}
          />
        )}

        {field.type === 'select' && field.options && (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {field.type === 'multiselect' && field.options && (
          <div className="mt-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {field.options.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    checked={(value as string[])?.includes(option) || false}
                    onChange={(e) => {
                      const currentValues = (value as string[]) || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleInputChange(field.id, newValues);
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}        {field.type === 'image' && (
          <div className="mt-1">
            <div 
              className={`flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors ${
                dragActive[field.id] ? 'bg-blue-50 border-blue-400' : 'hover:border-blue-400'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, field.id)}
              onDragLeave={(e) => handleDragLeave(e, field.id)}
              onDrop={(e) => handleFileDrop(e, field.id)}
            >
              <div className="space-y-1 text-center">
                {value && typeof value === 'object' && value.preview ? (
                  <div className="space-y-3">
                    <img 
                      src={value.preview} 
                      alt="Preview" 
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm text-gray-600">{value.name}</p>
                      <button
                        type="button"
                        onClick={() => handleInputChange(field.id, '')}
                        className="text-sm text-red-600 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor={`file-${field.id}`} className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input 
                          id={`file-${field.id}`} 
                          name={`file-${field.id}`} 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              console.log('File selected:', file.name, file.size, file.type);
                              
                              // Validate file size (10MB limit)
                              if (file.size > 10 * 1024 * 1024) {
                                alert('File size must be less than 10MB');
                                return;
                              }
                              
                              // Create preview URL
                              const preview = URL.createObjectURL(file);
                              console.log('Preview URL created:', preview);
                              
                              // Convert to base64 for storage
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                const fileData = {
                                  name: file.name,
                                  size: file.size,
                                  type: file.type,
                                  preview,
                                  base64
                                };
                                console.log('File processed successfully:', fileData);
                                handleInputChange(field.id, fileData);
                              };
                              reader.onerror = (error) => {
                                console.error('FileReader error:', error);
                                alert('Error reading file');
                              };
                              reader.readAsDataURL(file);
                            } else {
                              console.log('No file selected');
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!['textarea', 'select', 'multiselect', 'image'].includes(field.type) && (
          <input
            {...commonProps}
            type={field.type}
          />
        )}

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Templates
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Configure Your {template.name}
        </h2>
        <p className="text-lg text-gray-600">
          Fill in the details below to customize your PWA content.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {template.fields.map(renderField)}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Preview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormBuilder;
