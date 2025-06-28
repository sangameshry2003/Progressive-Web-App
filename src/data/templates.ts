import type { PWATemplate } from '../types';

export const templates: PWATemplate[] = [
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Professional digital business card with contact information',
    category: 'business',
    thumbnail: '/templates/business-card.png',
    features: ['Contact Information', 'Social Links', 'QR Code', 'Dark Mode'],
    fields: [
      {
        id: 'businessName',
        label: 'Business Name',
        type: 'text',
        placeholder: 'Your Business Name',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'tagline',
        label: 'Tagline',
        type: 'text',
        placeholder: 'Your business tagline',
        required: false,
        validation: { maxLength: 100 }
      },
      {
        id: 'ownerName',
        label: 'Owner/Manager Name',
        type: 'text',
        placeholder: 'John Doe',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'contact@business.com',
        required: true
      },
      {
        id: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        required: true
      },
      {
        id: 'website',
        label: 'Website',
        type: 'url',
        placeholder: 'https://yourbusiness.com',
        required: false
      },
      {
        id: 'address',
        label: 'Address',
        type: 'textarea',
        placeholder: '123 Business St, City, State 12345',
        required: false
      },
      {
        id: 'logo',
        label: 'Logo',
        type: 'image',
        required: false
      }
    ]
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work with a clean portfolio design',
    category: 'portfolio',
    thumbnail: '/templates/portfolio.png',
    features: ['Project Gallery', 'About Section', 'Contact Form', 'Responsive Design'],
    fields: [
      {
        id: 'name',
        label: 'Your Name',
        type: 'text',
        placeholder: 'Jane Smith',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'title',
        label: 'Professional Title',
        type: 'text',
        placeholder: 'Web Developer',
        required: true,
        validation: { minLength: 2, maxLength: 100 }
      },
      {
        id: 'bio',
        label: 'Bio',
        type: 'textarea',
        placeholder: 'Tell us about yourself...',
        required: true,
        validation: { minLength: 50, maxLength: 500 }
      },
      {
        id: 'skills',
        label: 'Skills',
        type: 'multiselect',
        required: true,
        options: [
          'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
          'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
          'HTML/CSS', 'SASS/SCSS', 'Tailwind CSS', 'Bootstrap',
          'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
          'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes'
        ]
      },
      {
        id: 'profileImage',
        label: 'Profile Image',
        type: 'image',
        required: false
      }
    ]
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    description: 'Digital menu for restaurants with categories and pricing',
    category: 'business',
    thumbnail: '/templates/restaurant.png',
    features: ['Menu Categories', 'Item Photos', 'Price Display', 'Search Function'],
    fields: [
      {
        id: 'restaurantName',
        label: 'Restaurant Name',
        type: 'text',
        placeholder: 'Delicious Eats',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'cuisine',
        label: 'Cuisine Type',
        type: 'select',
        required: true,
        options: [
          'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
          'French', 'American', 'Mediterranean', 'Greek', 'Korean', 'Other'
        ]
      },
      {
        id: 'description',
        label: 'Restaurant Description',
        type: 'textarea',
        placeholder: 'Brief description of your restaurant...',
        required: false,
        validation: { maxLength: 200 }
      },
      {
        id: 'address',
        label: 'Address',
        type: 'textarea',
        placeholder: '123 Food St, City, State 12345',
        required: true
      },
      {
        id: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        required: true
      },
      {
        id: 'hours',
        label: 'Operating Hours',
        type: 'textarea',
        placeholder: 'Mon-Fri: 11am-10pm\nSat-Sun: 12pm-11pm',
        required: true
      }
    ]
  },
  {
    id: 'event-landing',
    name: 'Event Landing',
    description: 'Promote events with registration and details',
    category: 'utility',
    thumbnail: '/templates/event.png',
    features: ['Event Details', 'Registration Form', 'Countdown Timer', 'Social Sharing'],
    fields: [
      {
        id: 'eventName',
        label: 'Event Name',
        type: 'text',
        placeholder: 'Amazing Conference 2024',
        required: true,
        validation: { minLength: 5, maxLength: 100 }
      },
      {
        id: 'eventDate',
        label: 'Event Date',
        type: 'text',
        placeholder: '2024-12-15',
        required: true
      },
      {
        id: 'eventTime',
        label: 'Event Time',
        type: 'text',
        placeholder: '9:00 AM - 5:00 PM',
        required: true
      },
      {
        id: 'venue',
        label: 'Venue',
        type: 'text',
        placeholder: 'Convention Center, City',
        required: true
      },
      {
        id: 'description',
        label: 'Event Description',
        type: 'textarea',
        placeholder: 'Describe your event...',
        required: true,
        validation: { minLength: 50, maxLength: 1000 }
      },
      {
        id: 'speakers',
        label: 'Featured Speakers',
        type: 'textarea',
        placeholder: 'List your speakers...',
        required: false
      },      {
        id: 'ticketPrice',
        label: 'Ticket Price',
        type: 'text',
        placeholder: '$99',
        required: false
      }
    ]
  },
  {
    id: 'e-commerce',
    name: 'E-commerce Store',
    description: 'Online store with product catalog and shopping features',
    category: 'e-commerce',
    thumbnail: '/templates/ecommerce.png',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Integration', 'Order Management'],
    fields: [
      {
        id: 'storeName',
        label: 'Store Name',
        type: 'text',
        placeholder: 'My Awesome Store',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'storeDescription',
        label: 'Store Description',
        type: 'textarea',
        placeholder: 'Describe your store and products...',
        required: true,
        validation: { minLength: 20, maxLength: 500 }
      },
      {
        id: 'storeLogo',
        label: 'Store Logo',
        type: 'image',
        required: false
      },
      {
        id: 'productCategories',
        label: 'Product Categories',
        type: 'multiselect',
        options: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health & Beauty', 'Food & Beverages'],
        required: true
      },
      {
        id: 'currency',
        label: 'Currency',
        type: 'select',
        options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
        required: true
      },
      {
        id: 'contactEmail',
        label: 'Contact Email',
        type: 'email',
        placeholder: 'support@store.com',
        required: true
      },
      {
        id: 'shippingInfo',
        label: 'Shipping Information',
        type: 'textarea',
        placeholder: 'Shipping policies and information...',
        required: false
      }
    ]
  },
  {
    id: 'blog',
    name: 'Blog/News Site',
    description: 'Content-focused blog with articles and news',
    category: 'blog',
    thumbnail: '/templates/blog.png',
    features: ['Article Management', 'Categories', 'Comments', 'SEO Optimized'],
    fields: [
      {
        id: 'blogTitle',
        label: 'Blog Title',
        type: 'text',
        placeholder: 'My Amazing Blog',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'blogSubtitle',
        label: 'Blog Subtitle',
        type: 'text',
        placeholder: 'Sharing thoughts and ideas',
        required: false,
        validation: { maxLength: 100 }
      },
      {
        id: 'authorName',
        label: 'Author Name',
        type: 'text',
        placeholder: 'John Blogger',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'authorBio',
        label: 'Author Bio',
        type: 'textarea',
        placeholder: 'Tell readers about yourself...',
        required: true,
        validation: { minLength: 20, maxLength: 500 }
      },
      {
        id: 'authorPhoto',
        label: 'Author Photo',
        type: 'image',
        required: false
      },
      {
        id: 'blogCategories',
        label: 'Blog Categories',
        type: 'multiselect',
        options: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Entertainment', 'Education'],
        required: true
      },
      {
        id: 'socialMedia',
        label: 'Social Media Links',
        type: 'textarea',
        placeholder: 'Twitter: @username, LinkedIn: linkedin.com/in/username',
        required: false
      }
    ]
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'High-converting landing page for products or services',
    category: 'utility',
    thumbnail: '/templates/landing.png',
    features: ['Call-to-Action', 'Lead Capture', 'Testimonials', 'Feature Highlights'],
    fields: [
      {
        id: 'productName',
        label: 'Product/Service Name',
        type: 'text',
        placeholder: 'Amazing Product',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'headline',
        label: 'Main Headline',
        type: 'text',
        placeholder: 'Transform Your Life with Our Product',
        required: true,
        validation: { minLength: 10, maxLength: 100 }
      },
      {
        id: 'subheadline',
        label: 'Sub-headline',
        type: 'text',
        placeholder: 'Join thousands of satisfied customers',
        required: false,
        validation: { maxLength: 150 }
      },
      {
        id: 'productImage',
        label: 'Product/Hero Image',
        type: 'image',
        required: false
      },
      {
        id: 'features',
        label: 'Key Features',
        type: 'multiselect',
        options: ['Easy to Use', 'Money Back Guarantee', '24/7 Support', 'Free Shipping', 'Secure Payment', 'Mobile App'],
        required: true
      },
      {
        id: 'pricing',
        label: 'Pricing',
        type: 'text',
        placeholder: '$99/month',
        required: true
      },
      {
        id: 'ctaText',
        label: 'Call-to-Action Text',
        type: 'text',
        placeholder: 'Get Started Now',
        required: true,
        validation: { minLength: 2, maxLength: 30 }
      },
      {
        id: 'contactEmail',
        label: 'Contact Email',
        type: 'email',
        placeholder: 'hello@product.com',
        required: true
      }
    ]
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit Organization',
    description: 'Showcase your mission and drive donations',
    category: 'utility',
    thumbnail: '/templates/nonprofit.png',
    features: ['Mission Statement', 'Donation Integration', 'Volunteer Signup', 'Impact Stories'],
    fields: [
      {
        id: 'organizationName',
        label: 'Organization Name',
        type: 'text',
        placeholder: 'Hope Foundation',
        required: true,
        validation: { minLength: 2, maxLength: 50 }
      },
      {
        id: 'mission',
        label: 'Mission Statement',
        type: 'textarea',
        placeholder: 'Our mission is to...',
        required: true,
        validation: { minLength: 50, maxLength: 500 }
      },
      {
        id: 'organizationLogo',
        label: 'Organization Logo',
        type: 'image',
        required: false
      },
      {
        id: 'causes',
        label: 'Causes/Focus Areas',
        type: 'multiselect',
        options: ['Education', 'Health', 'Environment', 'Poverty', 'Animals', 'Human Rights', 'Disaster Relief', 'Community Development'],
        required: true
      },
      {
        id: 'impactNumbers',
        label: 'Impact Numbers',
        type: 'textarea',
        placeholder: 'e.g., 1000 people helped, 50 schools built...',
        required: false
      },
      {
        id: 'donationGoal',
        label: 'Current Donation Goal',
        type: 'text',
        placeholder: '$50,000',
        required: false
      },
      {
        id: 'contactInfo',
        label: 'Contact Information',
        type: 'textarea',
        placeholder: 'Email, phone, address...',
        required: true
      }
    ]
  }
];
