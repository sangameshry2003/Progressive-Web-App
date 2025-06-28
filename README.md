# PWA Generator

A no-code Progressive Web App (PWA) generator built with React and TypeScript. This tool allows users to create fully functional PWAs through an intuitive form-based interface using customizable templates with user accounts, project management, and direct deployment capabilities.

## 🚀 Features

### Core PWA Generation

- **Template-Based Generation**: Choose from professionally designed templates
- **No-Code Interface**: Create PWAs without writing any code
- **Form-Driven Content**: Easy form-based content management
- **Image Upload Support**: Drag & drop image upload with preview and automatic embedding
- **PWA Capabilities**: Generated apps include offline support, installability, and push notifications
- **Responsive Design**: All templates are mobile-first and responsive
- **Real-Time Preview**: See your PWA before generating
- **Downloadable Files**: Get complete, deployable PWA files as ZIP package

### Advanced Customization

- **Theme Customizer**: Customize colors, fonts, spacing, and visual styles
- **Live Preview**: Real-time preview updates as you customize
- **Multiple Font Options**: Choose from popular web fonts
- **Color Picker**: Full color customization for branding
- **Border Radius Control**: Customize the roundness of UI elements

### User Accounts & Project Management

- **User Authentication**: Secure signup/login system with demo account
- **Project Saving**: Save and manage multiple PWA projects
- **Project Dashboard**: Organize projects with search, filtering, and sorting
- **Public/Private Projects**: Share projects publicly or keep them private
- **Project Duplication**: Clone existing projects for quick iteration
- **Project Statistics**: Track your project creation progress

### Deployment Integration

- **Direct Deployment**: Deploy PWAs directly from the interface
- **Multiple Providers**: Support for Netlify, Vercel, GitHub Pages, Firebase, and Surge
- **Configuration Management**: Easy deployment settings and domain configuration
- **Deployment Simulation**: Test deployment process with detailed feedback

## 📱 Available Templates

1. **Business Card** - Professional digital business cards with contact information
2. **Portfolio** - Showcase your work with project galleries and about sections
3. **Restaurant Menu** - Digital menus with categories, pricing, and photos
4. **Event Landing** - Promote events with registration and countdown timers
5. **E-commerce Store** - Online store with product catalog and shopping features
6. **Blog/News Site** - Content-focused blog with articles and categories
7. **Landing Page** - Product landing pages with features and pricing
8. **Non-Profit Organization** - Showcase mission and drive donations

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Vite PWA Plugin** - PWA capabilities and service worker generation
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form management and validation
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon system
- **Date-fns** - Date formatting and manipulation

## 🏗️ Architecture

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with authentication
│   ├── TemplateSelector.tsx  # Template selection interface
│   ├── FormBuilder.tsx # Dynamic form generation
│   ├── PWAPreview.tsx  # Mobile preview component
│   ├── PWAGenerator.tsx # Final generation and download
│   ├── ThemeCustomizer.tsx # Advanced theme customization
│   ├── DeploymentManager.tsx # Deployment provider integration
│   ├── AuthModal.tsx   # Login/signup modal
│   ├── UserMenu.tsx    # User account menu
│   ├── ProjectDashboard.tsx # Project management interface
│   └── SaveProjectModal.tsx # Project saving dialog
├── data/               # Static data and templates
│   └── templates.ts    # Template definitions
├── services/           # Business logic services
│   ├── authService.ts  # Authentication service
│   ├── projectService.ts # Project management service
│   └── deploymentService.ts # Deployment service
├── store/              # State management
│   ├── pwaStore.ts     # PWA generation store
│   ├── authStore.ts    # Authentication state
│   └── projectStore.ts # Project management state
├── types/              # TypeScript type definitions
│   └── index.ts        # App-wide types
└── main.tsx           # App entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pwa-generator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage

### Basic Workflow

1. **Choose a Template**: Select from available PWA templates
2. **Configure Content**: Fill in the form with your content and settings
3. **Customize Theme**: Use the theme customizer to brand your PWA
4. **Preview**: See how your PWA will look on mobile devices
5. **Generate**: Create your PWA files
6. **Save/Deploy**: Save project to your account or deploy directly

### User Account Features

#### Getting Started

- Click "Sign Up" in the header to create an account
- Use the demo account (demo@example.com / demo123) to try features immediately
- Access "My Projects" from the user menu to manage saved projects

#### Project Management

- **Save Projects**: After generating a PWA, save it to your account for later editing
- **Project Dashboard**: Access via user menu to view, search, and manage projects
- **Public/Private**: Choose whether to share projects publicly
- **Duplicate Projects**: Clone existing projects for quick iteration
- **Load Projects**: Resume work on saved projects from any step

#### Project Organization

- **Search**: Find projects by name, description, or tags
- **Filter**: Filter by template category
- **Sort**: Sort by date updated, created, or name
- **Tags**: Add custom tags for better organization

### Theme Customization

- **Colors**: Customize primary, secondary, background, and text colors
- **Typography**: Choose from popular web fonts and adjust sizing
- **Layout**: Control border radius and spacing
- **Live Preview**: See changes in real-time as you customize

### Deployment Options

- **Direct Deployment**: Deploy PWAs directly from the interface
- **Provider Support**:
  - Netlify (recommended for beginners)
  - Vercel (great for React developers)
  - GitHub Pages (free hosting)
  - Firebase Hosting (Google's platform)
  - Surge (simple static hosting)
- **Custom Domains**: Configure custom domains for professional deployments
- **Environment Variables**: Set up environment-specific configurations

## 🔧 Customization

### Adding New Templates

1. Define the template in `src/data/templates.ts`:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  description: 'Template description',
  category: 'business',
  features: ['Feature 1', 'Feature 2'],
  fields: [
    {
      id: 'fieldName',
      label: 'Field Label',
      type: 'text',
      required: true
    }
  ]
}
```

2. Add preview logic in `PWAPreview.tsx`
3. Add generation logic in `PWAGenerator.tsx`

### Customizing Styling

The app uses TailwindCSS. Modify `tailwind.config.js` to customize:

- Colors
- Fonts
- Spacing
- Animations

## 🔐 PWA Features

Generated PWAs include:

- **Service Worker**: Enables offline functionality
- **Web App Manifest**: Allows installation on devices
- **Responsive Design**: Works on all screen sizes
- **Fast Loading**: Optimized performance
- **Secure**: HTTPS-ready

## 📱 PWA Installation

Users can install generated PWAs:

1. **Mobile**: Tap "Add to Home Screen" in browser menu
2. **Desktop**: Click install button in browser address bar
3. **Manual**: Use browser's PWA installation prompt

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Create an issue for bug reports
- Check existing issues before creating new ones
- Provide detailed reproduction steps

## 🚀 Deployment

### Using Built-in Deployment

1. Generate your PWA using the interface
2. Click "Deploy to Web"
3. Choose a deployment provider
4. Configure settings (site name, domain, etc.)
5. Follow the deployment instructions

### Manual Deployment

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

#### GitHub Pages

```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

## 🎯 Demo Account

To try all features immediately, use the demo account:

- **Email**: demo@example.com
- **Password**: demo123

The demo account comes with:

- Pro subscription features
- Sample saved projects
- Full access to all templates and features

## ✅ Completed Features

- ✅ Multiple template categories (Business, Portfolio, E-commerce, Blog, Utility)
- ✅ Advanced theme customization (colors, fonts, spacing)
- ✅ Direct deployment integrations (Netlify, Vercel, GitHub Pages, Firebase, Surge)
- ✅ User accounts and authentication system
- ✅ Project saving and management
- ✅ Public/private project sharing
- ✅ Project search, filtering, and organization
- ✅ Project duplication and loading
- ✅ Real-time preview with theme customization
- ✅ Image upload with drag & drop
- ✅ Responsive design for all templates
- ✅ PWA capabilities (offline, installable)

## 🔮 Future Features

- [ ] Template marketplace for sharing custom templates
- [ ] Real deployment integration (currently simulated)
- [ ] Advanced analytics and usage tracking
- [ ] Multi-language support for international users
- [ ] Collaboration features for team projects
- [ ] Custom CSS injection for advanced users
- [ ] API integrations for dynamic content
- [ ] White-label solutions for agencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using React, TypeScript, and modern web technologies.

**Ready to create your next PWA? Start building with zero code required!**
