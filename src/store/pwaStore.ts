import { create } from 'zustand';
import type { PWATemplate, PWAConfig, GeneratedPWA } from '../types';

// Helper function to convert base64 to blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Helper function to generate icon files from uploaded images
const generateIconFiles = (config: PWAConfig): { path: string; content: string; type: 'image'; blob: Blob }[] => {
  const iconFiles: { path: string; content: string; type: 'image'; blob: Blob }[] = [];
  
  // Check for logo (business card template)
  if (config.customData.logo && config.customData.logo.base64) {
    const blob = base64ToBlob(config.customData.logo.base64, config.customData.logo.type);
    iconFiles.push({
      path: 'icon-192x192.png',
      content: config.customData.logo.base64,
      type: 'image',
      blob
    });
    iconFiles.push({
      path: 'icon-512x512.png', 
      content: config.customData.logo.base64,
      type: 'image',
      blob
    });
  }
  
  // Check for profile image (portfolio template)  
  if (config.customData.profileImage && config.customData.profileImage.base64) {
    const blob = base64ToBlob(config.customData.profileImage.base64, config.customData.profileImage.type);
    if (iconFiles.length === 0) {
      // Use profile image as app icon if no logo
      iconFiles.push({
        path: 'icon-192x192.png',
        content: config.customData.profileImage.base64,
        type: 'image',
        blob
      });
      iconFiles.push({
        path: 'icon-512x512.png',
        content: config.customData.profileImage.base64, 
        type: 'image',
        blob
      });
    }
  }
  
  // Generate default icons if no images uploaded
  if (iconFiles.length === 0) {
    const defaultIcon = generateDefaultIcon(config.themeColor);
    iconFiles.push({
      path: 'icon-192x192.png',
      content: defaultIcon,
      type: 'image',
      blob: base64ToBlob(defaultIcon, 'image/png')
    });
    iconFiles.push({
      path: 'icon-512x512.png',
      content: defaultIcon,
      type: 'image', 
      blob: base64ToBlob(defaultIcon, 'image/png')
    });
  }
  
  return iconFiles;
};

// Generate a simple default icon using canvas
const generateDefaultIcon = (themeColor: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Background
    ctx.fillStyle = themeColor;
    ctx.fillRect(0, 0, 512, 512);
    
    // Simple PWA text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PWA', 256, 256);
  }
  
  return canvas.toDataURL('image/png');
};

// PWA File Generation Functions
const generateHTML = (config: PWAConfig): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.appName}</title>
    <meta name="description" content="${config.description}">
    <meta name="theme-color" content="${config.themeColor}">
    <link rel="manifest" href="./manifest.json">
    <link rel="stylesheet" href="./styles.css">
    <link rel="icon" href="./icon-192x192.png" type="image/png">
</head>
<body>
    <div id="app">
        <header>
            <h1>${config.appName}</h1>
            <p>${config.description}</p>
        </header>
        <main>
            ${generateTemplateContent(config)}
        </main>
    </div>
    <script src="./app.js"></script>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => console.log('SW registered'))
                .catch(error => console.log('SW registration failed'));
        }
    </script>
</body>
</html>`;
};

const generateManifest = (config: PWAConfig): string => {
  const manifest = {
    name: config.appName,
    short_name: config.shortName,
    description: config.description,
    start_url: "/",
    display: "standalone",
    background_color: config.backgroundColor,
    theme_color: config.themeColor,
    icons: [
      {
        src: "icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
  return JSON.stringify(manifest, null, 2);
};

const generateServiceWorker = (): string => {
  return `const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});`;
};

const generateCSS = (config: PWAConfig): string => {
  return `/* PWA Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: ${config.backgroundColor};
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: ${config.themeColor};
  color: white;
  padding: 1rem;
  text-align: center;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

main {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  main {
    padding: 1rem;
  }
  
  header h1 {
    font-size: 1.5rem;
  }
}`;
};

const generateJS = (config: PWAConfig): string => {
  return `// PWA App Logic
class PWAApp {
  constructor() {
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.loadData();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      const installBtn = document.createElement('button');
      installBtn.textContent = 'Install App';
      installBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: ${config.themeColor}; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; z-index: 1000;';
      
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const result = await deferredPrompt.userChoice;
          if (result.outcome === 'accepted') {
            installBtn.remove();
          }
          deferredPrompt = null;
        }
      });
      
      document.body.appendChild(installBtn);
    });
  }

  loadData() {
    const customData = ${JSON.stringify(config.customData, null, 4)};
    this.renderContent(customData);
  }

  renderContent(data) {
    console.log('Rendering PWA content with data:', data);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PWAApp();
});`;
};

const generateTemplateContent = (config: PWAConfig): string => {
  const data = config.customData;
  
  switch (config.templateId) {
    case 'business-card':
      return `<div class="card">
          ${data.logo && data.logo.base64 ? `
            <div style="text-align: center; margin-bottom: 1rem;">
              <img src="${data.logo.base64}" alt="Business Logo" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb;">
            </div>
          ` : ''}
          <h2>${data.businessName || 'Business Name'}</h2>
          ${data.tagline ? `<p>${data.tagline}</p>` : ''}
          <div style="margin-top: 1rem;">
            <p><strong>${data.ownerName || 'Owner Name'}</strong></p>
            <p>📧 ${data.email || 'email@example.com'}</p>
            <p>📞 ${data.phone || 'Phone Number'}</p>
            ${data.website ? `<p>🌐 ${data.website}</p>` : ''}
            ${data.address ? `<p>📍 ${data.address}</p>` : ''}
          </div>
        </div>`;
      
    case 'portfolio':
      return `<div class="card">
          ${data.profileImage && data.profileImage.base64 ? `
            <div style="text-align: center; margin-bottom: 1rem;">
              <img src="${data.profileImage.base64}" alt="Profile Image" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid ${config.themeColor};">
            </div>
          ` : ''}
          <h2>${data.name || 'Your Name'}</h2>
          <h3>${data.title || 'Professional Title'}</h3>
          <p>${data.bio || 'Bio will appear here...'}</p>
          ${data.skills && data.skills.length ? `
            <div style="margin-top: 1rem;">
              <h4>Skills:</h4>
              <div>${data.skills.map((skill: string) => `<span style="display: inline-block; background: ${config.themeColor}; color: white; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 0.9rem;">${skill}</span>`).join('')}</div>
            </div>
          ` : ''}
        </div>`;
      
    case 'restaurant-menu':
      return `<div class="card">
          <h2>${data.restaurantName || 'Restaurant Name'}</h2>
          <p><strong>Cuisine:</strong> ${data.cuisine || 'Cuisine Type'}</p>
          ${data.description ? `<p>${data.description}</p>` : ''}
          <div style="margin-top: 1rem;">
            <h4>Contact Information</h4>
            <p>📍 ${data.address || 'Address'}</p>
            <p>📞 ${data.phone || 'Phone'}</p>
            <p>🕒 ${data.hours || 'Hours'}</p>
          </div>
        </div>`;
        case 'event-landing':
      return `<div class="card">
          <h2>${data.eventName || 'Event Name'}</h2>
          <p><strong>Date:</strong> ${data.eventDate || 'Event Date'}</p>
          <p><strong>Time:</strong> ${data.eventTime || 'Event Time'}</p>
          <p><strong>Venue:</strong> ${data.venue || 'Venue'}</p>
          ${data.description ? `<p style="margin-top: 1rem;">${data.description}</p>` : ''}
          ${data.speakers ? `
            <div style="margin-top: 1rem;">
              <h4>Featured Speakers</h4>
              <p>${data.speakers}</p>
            </div>
          ` : ''}
          ${data.ticketPrice ? `<p style="margin-top: 1rem;"><strong>Price:</strong> ${data.ticketPrice}</p>` : ''}
        </div>`;

    case 'e-commerce':
      return `<div class="card">
          ${data.storeLogo && data.storeLogo.base64 ? `
            <div style="text-align: center; margin-bottom: 1rem;">
              <img src="${data.storeLogo.base64}" alt="Store Logo" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
          ` : ''}
          <h2>${data.storeName || 'Online Store'}</h2>
          <p>${data.storeDescription || 'Welcome to our store!'}</p>
          ${data.productCategories && data.productCategories.length ? `
            <div style="margin-top: 1rem;">
              <h4>Product Categories:</h4>
              <div>${data.productCategories.map((category: string) => `<span style="display: inline-block; background: #3b82f6; color: white; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 0.9rem;">${category}</span>`).join('')}</div>
            </div>
          ` : ''}
          <div style="margin-top: 1rem;">
            <p><strong>Currency:</strong> ${data.currency || 'USD'}</p>
            <p>📧 ${data.contactEmail || 'support@store.com'}</p>
            ${data.shippingInfo ? `<p style="margin-top: 0.5rem;"><small>${data.shippingInfo}</small></p>` : ''}
          </div>
        </div>`;

    case 'blog':
      return `<div class="card">
          ${data.authorPhoto && data.authorPhoto.base64 ? `
            <div style="text-align: center; margin-bottom: 1rem;">
              <img src="${data.authorPhoto.base64}" alt="Author Photo" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;">
            </div>
          ` : ''}
          <h2>${data.blogTitle || 'My Blog'}</h2>
          ${data.blogSubtitle ? `<p style="font-style: italic; color: #666;">${data.blogSubtitle}</p>` : ''}
          <div style="margin-top: 1rem;">
            <p><strong>Author:</strong> ${data.authorName || 'Blog Author'}</p>
            <p>${data.authorBio || 'Welcome to my blog!'}</p>
          </div>
          ${data.blogCategories && data.blogCategories.length ? `
            <div style="margin-top: 1rem;">
              <h4>Categories:</h4>
              <div>${data.blogCategories.map((category: string) => `<span style="display: inline-block; background: #10b981; color: white; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 0.9rem;">${category}</span>`).join('')}</div>
            </div>
          ` : ''}
          ${data.socialMedia ? `<p style="margin-top: 1rem;"><small>${data.socialMedia}</small></p>` : ''}
        </div>`;

    case 'landing-page':
      return `<div class="card" style="text-align: center;">
          ${data.productImage && data.productImage.base64 ? `
            <div style="margin-bottom: 1.5rem;">
              <img src="${data.productImage.base64}" alt="Product Image" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin: 0 auto;">
            </div>
          ` : ''}
          <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">${data.headline || 'Amazing Product'}</h1>
          ${data.subheadline ? `<p style="font-size: 1.1rem; color: #666; margin-bottom: 1rem;">${data.subheadline}</p>` : ''}
          <h2>${data.productName || 'Product Name'}</h2>
          ${data.features && data.features.length ? `
            <div style="margin: 1rem 0;">
              <h4>Features:</h4>
              <div>${data.features.map((feature: string) => `<span style="display: inline-block; background: #f59e0b; color: white; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 0.9rem;">${feature}</span>`).join('')}</div>
            </div>
          ` : ''}
          <div style="margin-top: 1.5rem;">
            <p style="font-size: 1.2rem; font-weight: bold;">${data.pricing || 'Contact for Pricing'}</p>
            <button style="background: #ef4444; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 1rem; margin-top: 1rem; cursor: pointer;">${data.ctaText || 'Get Started'}</button>
          </div>
          <p style="margin-top: 1rem;">📧 ${data.contactEmail || 'contact@product.com'}</p>
        </div>`;

    case 'nonprofit':
      return `<div class="card">
          ${data.organizationLogo && data.organizationLogo.base64 ? `
            <div style="text-align: center; margin-bottom: 1rem;">
              <img src="${data.organizationLogo.base64}" alt="Organization Logo" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
          ` : ''}
          <h2>${data.organizationName || 'Non-Profit Organization'}</h2>
          <p><strong>Mission:</strong> ${data.mission || 'Our mission statement...'}</p>
          ${data.causes && data.causes.length ? `
            <div style="margin-top: 1rem;">
              <h4>Focus Areas:</h4>
              <div>${data.causes.map((cause: string) => `<span style="display: inline-block; background: #8b5cf6; color: white; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 0.9rem;">${cause}</span>`).join('')}</div>
            </div>
          ` : ''}
          ${data.impactNumbers ? `
            <div style="margin-top: 1rem;">
              <h4>Our Impact:</h4>
              <p>${data.impactNumbers}</p>
            </div>
          ` : ''}
          ${data.donationGoal ? `<p style="margin-top: 1rem;"><strong>Current Goal:</strong> ${data.donationGoal}</p>` : ''}
          <div style="margin-top: 1rem;">
            <h4>Contact Us:</h4>
            <p>${data.contactInfo || 'Contact information...'}</p>
          </div>
        </div>`;
      
    default:
      return `<div class="card">
          <h2>Welcome to your PWA!</h2>
          <p>This is a basic PWA template.</p>
        </div>`;
  }
};

interface PWAStore {
  // Templates
  templates: PWATemplate[];
  selectedTemplate: PWATemplate | null;
  
  // Form data
  formData: Record<string, any>;
  
  // Generated PWAs
  generatedPWAs: GeneratedPWA[];
  
  // UI state
  currentStep: number;
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  setSelectedTemplate: (template: PWATemplate) => void;
  updateFormData: (field: string, value: any) => void;
  setCurrentStep: (step: number) => void;
  generatePWA: (config: PWAConfig) => Promise<void>;
  clearError: () => void;
  resetForm: () => void;
}

export const usePWAStore = create<PWAStore>((set) => ({
  templates: [],
  selectedTemplate: null,
  formData: {},
  generatedPWAs: [],
  currentStep: 1,
  isGenerating: false,
  error: null,
  
  setSelectedTemplate: (template) => set({ selectedTemplate: template, formData: {} }),
  
  updateFormData: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value }
  })),
  
  setCurrentStep: (step) => set({ currentStep: step }),
    generatePWA: async (config: PWAConfig) => {
    set({ isGenerating: true, error: null });
    
    try {
      // Simulate PWA generation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate icon files from uploaded images
      const iconFiles = generateIconFiles(config);
      
      // Generate PWA files based on template and config
      const files = [
        {
          path: 'index.html',
          content: generateHTML(config),
          type: 'html' as const,
          blob: new Blob([generateHTML(config)], { type: 'text/html' })
        },
        {
          path: 'manifest.json',
          content: generateManifest(config),
          type: 'manifest' as const,
          blob: new Blob([generateManifest(config)], { type: 'application/json' })
        },
        {
          path: 'sw.js',
          content: generateServiceWorker(),
          type: 'sw' as const,
          blob: new Blob([generateServiceWorker()], { type: 'application/javascript' })
        },
        {
          path: 'styles.css',
          content: generateCSS(config),
          type: 'css' as const,
          blob: new Blob([generateCSS(config)], { type: 'text/css' })
        },
        {
          path: 'app.js',
          content: generateJS(config),
          type: 'js' as const,
          blob: new Blob([generateJS(config)], { type: 'application/javascript' })
        },
        ...iconFiles
      ];
      
      const generatedPWA: GeneratedPWA = {
        id: Date.now().toString(),
        config,
        files,
        createdAt: new Date()
      };
      
      set((state) => ({
        generatedPWAs: [...state.generatedPWAs, generatedPWA],
        isGenerating: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isGenerating: false 
      });
    }
  },
  
  clearError: () => set({ error: null }),
  
  resetForm: () => set({ 
    selectedTemplate: null, 
    formData: {}, 
    currentStep: 1, 
    error: null 
  })
}));
