import { useState } from 'react'
import Header from './components/Header'
import TemplateSelector from './components/TemplateSelector'
import FormBuilder from './components/FormBuilder'
import PWAPreview from './components/PWAPreview'
import PWAGenerator from './components/PWAGenerator'
import ProjectDashboard from './components/ProjectDashboard'
import { templates } from './data/templates'
import { usePWAStore } from './store/pwaStore'
import type { PWATemplate, PWAConfig, ThemeOptions, SavedProject } from './types'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<PWATemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [theme, setTheme] = useState<ThemeOptions>({
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    borderRadius: '8px'
  })
  const [showProjectDashboard, setShowProjectDashboard] = useState(false)
  const { generatePWA, isGenerating } = usePWAStore()

  const handleTemplateSelect = (template: PWATemplate) => {
    setSelectedTemplate(template)
    setFormData({})
    setCurrentStep(2)
  }

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data)
    setCurrentStep(3)
  }

  const handleLoadProject = (project: SavedProject) => {
    setSelectedTemplate(project.template)
    setFormData(project.formData)
    setTheme(project.theme)
    setShowProjectDashboard(false)
    setCurrentStep(3) // Go to preview step
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) return
    
    // Create PWA config from form data and template
    const config: PWAConfig = {
      templateId: selectedTemplate.id,
      appName: formData.businessName || formData.name || formData.restaurantName || formData.eventName || 'My PWA',
      shortName: (formData.businessName || formData.name || formData.restaurantName || formData.eventName || 'PWA').substring(0, 12),
      description: formData.tagline || formData.bio || formData.description || 'A Progressive Web App',
      themeColor: theme.primaryColor,
      backgroundColor: theme.backgroundColor,
      icon: '/icon-192x192.png',
      customData: formData,
      theme: theme
    }

    // Generate PWA using store
    await generatePWA(config)
    setCurrentStep(4)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedTemplate(null)
    setFormData({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenProjects={() => setShowProjectDashboard(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'}`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 
                    ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-600">
              {currentStep === 1 && 'Choose Template'}
              {currentStep === 2 && 'Configure Content'}
              {currentStep === 3 && 'Preview & Generate'}
              {currentStep === 4 && 'Download Your PWA'}
            </p>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <TemplateSelector 
            templates={templates}
            onSelect={handleTemplateSelect}
          />
        )}

        {currentStep === 2 && selectedTemplate && (
          <FormBuilder 
            template={selectedTemplate}
            initialData={formData}
            onSubmit={handleFormSubmit}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && selectedTemplate && (
          <PWAPreview 
            template={selectedTemplate}
            formData={formData}
            onGenerate={handleGenerate}
            onBack={() => setCurrentStep(2)}
            isGenerating={isGenerating}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}

        {currentStep === 4 && selectedTemplate && (
          <PWAGenerator 
            template={selectedTemplate}
            formData={formData}
            theme={theme}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Project Dashboard Modal */}
      <ProjectDashboard
        isOpen={showProjectDashboard}
        onClose={() => setShowProjectDashboard(false)}
        onLoadProject={handleLoadProject}
      />
    </div>
  )
}

export default App
