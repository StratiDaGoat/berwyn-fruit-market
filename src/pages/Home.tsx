import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Home.scss';
import { HomeSlideshow } from '../components/HomeSlideshow';

/**
 * Home page component featuring hero section and featured products
 * Showcases the market's fresh produce with engaging animations
 */
export const Home: React.FC = () => {
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
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to{' '}
              <span className="hero__title-accent">Berwyn Fruit Market</span>
            </motion.h1>
            
            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              YOUR NEIGHBORHOOD FRESH MARKET & QUALITY BUTCHER SHOP
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/departments" className="btn btn--primary btn--large">
                Explore Departments
              </Link>
              <Link to="/about" className="btn btn--secondary btn--large">
                Learn About Us
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__image"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero__image-slideshow">
              <HomeSlideshow />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.div
            className="features__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="features__item" variants={itemVariants}>
              <div className="features__icon">🌱</div>
              <h3 className="features__title">Locally Sourced</h3>
              <p className="features__description">
                We partner with local farms to bring you the freshest produce 
                while supporting our community.
              </p>
            </motion.div>

            <motion.div className="features__item" variants={itemVariants}>
              <div className="features__icon">🌿</div>
              <h3 className="features__title">Organic Options</h3>
              <p className="features__description">
                Choose from our wide selection of organic fruits and vegetables 
                grown without harmful pesticides.
              </p>
            </motion.div>

            <motion.div className="features__item" variants={itemVariants}>
              <div className="features__icon">👥</div>
              <h3 className="features__title">Community Focused</h3>
              <p className="features__description">
                We're more than just a market - we're a gathering place for 
                our community to connect and thrive.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
