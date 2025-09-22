import React from 'react';
import { motion } from 'framer-motion';
import './About.scss';

/**
 * About page component showcasing the market's story and values
 * Features animated sections with company information
 */
export const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            className="about-hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="about-hero__title">About Us</h1>
            <p className="about-hero__subtitle">
              A family-owned business dedicated to bringing fresh, local produce 
              to our community for over five decades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story">
        <div className="container">
          <motion.div
            className="story__content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="story__text" variants={itemVariants}>
              <h2 className="story__title">About Berwyn Fruit Market</h2>
              <p className="story__paragraph">
                We have a commitment to provide our partions with the fresh produce at a great price. Berwyn Fruit Market is a full service grocery store. Our greatest pride is providing you, our valued customer,
                with fast, friendly service and only the freshest and highest quality meat, produce, deli, and fresh bakery products available.
              </p>
              <p className="story__paragraph">
                Our employees are all members of the communities in which the stores are located and we are dedicated to their training and development as Berywn Fruit Market associates. Berwyn Fruit Market also remains 
                dedicated to the communities we serve - and who support us - by offering our full support to their organizations and events that enhance the quality of life of all members of the community.
              </p>
            </motion.div>

            <motion.div className="story__image" variants={itemVariants}>
              <div className="story__image-placeholder">
                🏪🌽🥕🍎
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <div className="container">
          <motion.div
            className="values__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="values__title">Our Values</h2>
            <p className="values__subtitle">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            className="values__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="values__item" variants={itemVariants}>
              <div className="values__icon">🌱</div>
              <h3 className="values__item-title">Freshness First</h3>
              <p className="values__item-description">
                We never compromise on quality. Every item in our store is 
                carefully selected for peak freshness and flavor.
              </p>
            </motion.div>

            <motion.div className="values__item" variants={itemVariants}>
              <div className="values__icon">🌍</div>
              <h3 className="values__item-title">Sustainability</h3>
              <p className="values__item-description">
                We promote environmentally friendly practices and offer 
                organic options to support sustainable agriculture.
              </p>
            </motion.div>

            <motion.div className="values__item" variants={itemVariants}>
              <div className="values__icon">❤️</div>
              <h3 className="values__item-title">Customer Care</h3>
              <p className="values__item-description">
                Every customer is treated like family. We're here to help 
                you find exactly what you need with a smile.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
