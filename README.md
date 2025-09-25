# Berwyn Fruit Market

A modern, responsive website for Berwyn Fruit Market - a vibrant local produce store showcasing fresh fruits, vegetables, and community spirit.

## 🌟 Features

- **Modern Design**: Clean, vibrant interface inspired by fresh produce
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Animations**: Smooth transitions powered by Framer Motion
- **TypeScript**: Full type safety and better development experience
- **SCSS Styling**: Organized, maintainable styles with variables and mixins
- **React Router**: Client-side routing for seamless navigation
- **Accessibility**: WCAG compliant with proper focus management
- **SEO Optimized**: Meta tags and structured content for search engines

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**
   ```bash
   cd C:\Users\insan\Desktop\berwyn-fruit-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   copy env.example .env
   ```
   Edit `.env` with your specific configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the website.

## 📁 Project Structure

```
berwyn-fruit-market/
├── public/                 # Static assets
│   ├── favicon.svg        # Site favicon
│   └── index.html         # HTML template
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Footer.tsx     # Site footer
│   │   └── *.scss         # Component styles
│   ├── pages/             # Page-level components
│   │   ├── Home.tsx       # Homepage
│   │   ├── About.tsx      # About page
│   │   ├── Products.tsx   # Products listing
│   │   ├── Contact.tsx    # Contact page
│   │   └── *.scss         # Page styles
│   ├── styles/            # Global styles
│   │   ├── variables.scss # SCSS variables
│   │   └── global.scss    # Global styles
│   ├── assets/            # Static assets
│   │   ├── images/        # Image files
│   │   └── fonts/         # Font files
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Application entry point
├── .eslintrc.cjs          # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🎨 Design System

### Color Palette

- **Primary Green**: #4CAF50 (Fresh lettuce green)
- **Primary Orange**: #FF9800 (Vibrant orange)
- **Primary Red**: #F44336 (Ripe tomato red)
- **Primary Yellow**: #FFEB3B (Sunny lemon yellow)
- **Secondary Green**: #8BC34A (Light green)
- **Secondary Orange**: #FFC107 (Golden yellow)

### Typography

- **Primary Font**: Poppins (Sans-serif)
- **Display Font**: Playfair Display (Serif)

## 📱 Responsive Design

The website is built with a mobile-first approach:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## 🔧 Customization

### Environment Variables

Configure the following in your `.env` file:

```env
VITE_SITE_NAME="Berwyn Fruit Market"
VITE_SITE_DESCRIPTION="Fresh fruits and vegetables from your local community market"
VITE_MARKET_ADDRESS="123 Main Street, Berwyn, IL 60402"
VITE_MARKET_PHONE="(708) 555-0123"
```

### Styling

- Modify `src/styles/variables.scss` for color and spacing changes
- Update component-specific SCSS files for individual styling
- Global styles are in `src/styles/global.scss`

### Content

- Update page components in `src/pages/` for content changes
- Modify product data in the respective page components
- Add new pages by creating components and updating the router

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Static Hosting

The built files can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload the `dist` folder contents

## 📞 Support

For support or questions about this project, please contact:

- **Phone**: (708) 795-6670
- **Address**: 3811 S. Harlem Ave, Berwyn, IL 60402

---

**Berwyn Fruit Market** - Fresh • Local • Community

