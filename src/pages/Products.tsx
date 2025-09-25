import React from 'react';
import { motion } from 'framer-motion';
import './Products.scss';
import { DepartmentSlideshow } from '../components/DepartmentSlideshow';
import { departments } from '../data/departments';

/**
 * Departments page component showcasing all store departments
 * Features department cards with descriptions and navigation
 */
export const Products: React.FC = () => {


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
