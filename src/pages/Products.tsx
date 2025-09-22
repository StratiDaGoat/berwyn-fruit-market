import React from 'react';
import { motion } from 'framer-motion';
import './Products.scss';
import { DepartmentSlideshow } from '../components/DepartmentSlideshow';

/**
 * Departments page component showcasing all store departments
 * Features department cards with descriptions and navigation
 */
export const Products: React.FC = () => {
  // Map department ids to explicit image filenames in public/
  const departments = [
    {
      id: 'meat',
      name: 'Meat Department',
      description: 'Fresh cuts of beef, pork, chicken, and specialty meats. Our expert butchers prepare everything daily.',
      icon: '🥩',
      color: '#E91E63',
      images: ['/meat-1.jpg', '/meat-2.jpg'],
      features: ['Fresh Daily Cuts', 'Custom Orders', 'Expert Butchers', 'Quality Guaranteed']
    },
    {
      id: 'deli',
      name: 'Deli',
      description: 'Premium deli meats, cheeses, and prepared foods. Perfect for sandwiches and entertaining.',
      icon: '🧀',
      color: '#FF9800',
      images: ['/deli-1.jpg', '/deli-2.jpg'],
      features: ['Premium Meats', 'Artisan Cheeses', 'Prepared Foods', 'Custom Slicing']
    },
    {
      id: 'produce',
      name: 'Produce',
      description: 'Fresh fruits and vegetables sourced from local farms. Always crisp, always fresh.',
      icon: '🥬',
      color: '#4CAF50',
      images: ['/produce-1.jpg', '/produce-2.jpg'],
      features: ['Local Sourcing', 'Organic Options', 'Daily Fresh', 'Seasonal Variety']
    },
    {
      id: 'imports',
      name: 'Import Groceries',
      description: 'International foods and specialty items from around the world. Discover new flavors.',
      icon: '🌍',
      color: '#2196F3',
      images: ['/imports-1.jpg', '/imports-2.jpg'],
      features: ['International Foods', 'Specialty Items', 'Unique Flavors', 'Global Selection']
    },
    {
      id: 'beer',
      name: 'Beer, Liquor & Wine',
      description: 'Curated selection of craft beers, fine wines, and premium spirits for every occasion.',
      icon: '🍷',
      color: '#9C27B0',
      images: ['/beer-1.jpg'],
      features: ['Craft Beers', 'Fine Wines', 'Premium Spirits', 'Expert Recommendations']
    },
    {
      id: 'hotFood',
      name: 'Hot Foods',
      description: 'Ready-to-eat meals, hot soups, and fresh prepared foods. Perfect for busy families.',
      icon: '🍲',
      color: '#F44336',
      images: ['/hotFood-1.jpg', '/hotFood-2.jpg', '/hotFood-3.jpg', '/hotFood-4.jpg'],
      features: ['Ready-to-Eat', 'Hot Soups', 'Fresh Prepared', 'Family Meals']
    }
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="departments">
      {/* Hero Section */}
      <section className="departments-hero">
        <div className="container">
          <motion.div
            className="departments-hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="departments-hero__title">Our Departments</h1>
            <p className="departments-hero__subtitle">
              Explore our full-service grocery store with dedicated departments 
              offering the finest quality products and expert service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="departments-grid">
        <div className="container">
          <motion.div
            className="departments-grid__content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {departments.map((department) => (
              <motion.div
                key={department.id}
                className="department-card"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="department-card__header department-card__header--media">
                  <DepartmentSlideshow
                    departmentId={department.id}
                    images={('images' in department ? (department as any).images : undefined)}
                    imageCount={('images' in department ? undefined : 1)}
                    className="department-card__media"
                  />
                  <h3 className="department-card__title">{department.name}</h3>
                </div>
                
                <div className="department-card__content">
                  <p className="department-card__description">
                    {department.description}
                  </p>
                  
                  <div className="department-card__features">
                    {department.features.map((feature, index) => (
                      <span key={index} className="department-card__feature">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA removed as requested */}
    </div>
  );
};
