import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faGlobe, faHeart } from '@fortawesome/free-solid-svg-icons';
import './About.scss';

/**
 * About page component showcasing the market's story and values
 * Features animated sections with company information
 */
export const About: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: '/old-store.jpg',
      alt: 'Berwyn Fruit Market storefront - original location',
    },
    {
      src: '/76-store.jpeg',
      alt: 'Berwyn Fruit Market storefront - current location',
    },
  ];

  // Auto-rotate images every 7.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % images.length;
        return newIndex;
      });
    }, 7500);

    return () => clearInterval(interval);
  }, [images.length]);

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
              to our community for over 50 years.
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
                Since 1980, Berwyn Fruit Market has been more than just a
                grocery store—we&apos;re a part of the community. We&apos;ve
                been serving our neighborhood with quality fresh groceries at a
                great price. As a full-service grocery store, we take pride in
                offering only the freshest produce, meats, deli and baked
                products, all backed by prompt and respectful service. Our staff
                lives and works in the same communities we serve, and we&apos;re
                committed to their prosperity and development as valued members
                of the Berwyn Fruit Market team.
              </p>
              <p className="story__paragraph">
                At Berwyn Fruit Market, we believe in keeping it simple: to
                offer you the freshest produce, the finest service, and the care
                that only a neighborhood market, after so many years of
                tradition, can provide.
              </p>
              <p className="story__paragraph">
                Have questions? We&apos;d love to hear from you. Visit us in
                store or give us a call.
              </p>
            </motion.div>

            <motion.div className="story__image" variants={itemVariants}>
              <div className="story__image-container">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`story__image-media ${index === currentImageIndex ? 'story__image-media--active' : ''}`}
                    decoding={index === 0 ? 'sync' : 'async'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    draggable={false}
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src.endsWith('.jpg'))
                        target.src = target.src.replace('.jpg', '.png');
                    }}
                  />
                ))}
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
              <div className="values__icon values__icon--fresh">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <h3 className="values__item-title">Freshness First</h3>
              <p className="values__item-description">
                We never compromise on quality. Every item in our store is
                carefully selected for peak freshness and flavor.
              </p>
            </motion.div>

            <motion.div className="values__item" variants={itemVariants}>
              <div className="values__icon values__icon--global">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
              <h3 className="values__item-title">Cater to All Cultures</h3>
              <p className="values__item-description">
                From imported groceries to specialty items, we stock goods from
                around the world so every culture can find familiar flavors at
                our market.
              </p>
            </motion.div>

            <motion.div className="values__item" variants={itemVariants}>
              <div className="values__icon values__icon--care">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="values__item-title">Customer Care</h3>
              <p className="values__item-description">
                Every customer is treated like family. We&apos;re here to help
                you find exactly what you need with a smile.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
