export type Department = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  images: string[];
  features: string[];
};

export const departments: Department[] = [
  {
    id: 'produce',
    name: 'Produce',
    description:
      'Fresh fruits and vegetables sourced from local farms. Always crisp, always fresh.',
    icon: '🥬',
    color: '#4CAF50',
    images: ['/produce-1.jpg', '/produce-2.jpg'],
    features: ['Local Sourcing', 'Organic Options', 'Daily Fresh', 'Seasonal Variety'],
  },
  {
    id: 'meat',
    name: 'Meat Department',
    description:
      'Fresh cuts of beef, pork, chicken, and specialty meats. Our expert butchers prepare everything daily.',
    icon: '🥩',
    color: '#E91E63',
    images: ['/meat-1.jpg', '/meat-2.jpg'],
    features: ['Fresh Daily Cuts', 'Custom Orders', 'Expert Butchers', 'Quality Guaranteed'],
  },
  {
    id: 'hotFood',
    name: 'Hot Foods',
    description:
      'Ready-to-eat meals, hot soups, and fresh prepared foods. Perfect for busy families.',
    icon: '🍲',
    color: '#F44336',
    images: ['/hotFood-1.jpg', '/hotFood-2.jpg', '/hotFood-3.jpg', '/hotFood-4.jpg'],
    features: ['Ready-to-Eat', 'Fresh Prepared', 'Family Meals'],
  },
  {
    id: 'deli',
    name: 'Deli',
    description:
      'Premium deli meats, cheeses, and prepared foods. Perfect for sandwiches and entertaining.',
    icon: '🧀',
    color: '#FF9800',
    images: ['/deli-1.jpg', '/deli-2.jpg'],
    features: ['Premium Meats', 'Artisan Cheeses', 'Prepared Foods', 'Custom Slicing'],
  },
  {
    id: 'imports',
    name: 'Import Groceries',
    description:
      'International foods and specialty items from around the world. Discover new flavors.',
    icon: '🌍',
    color: '#2196F3',
    images: ['/imports-1.jpg', '/imports-2.jpg'],
    features: ['International Foods', 'Specialty Items', 'Unique Flavors', 'Global Selection'],
  },
  {
    id: 'beer',
    name: 'Beer, Liquor & Wine',
    description:
      'Curated selection of craft beers, fine wines, and premium spirits for every occasion.',
    icon: '🍷',
    color: '#9C27B0',
    images: ['/beer-1.jpg'],
    features: ['Craft Beers', 'Fine Wines', 'Premium Spirits', 'Expert Recommendations'],
  },
];


