import React from 'react';
import { motion } from 'framer-motion';
import './Contact.scss';

/**
 * Contact page component with contact form and store information
 * Features animated form elements and interactive map placeholder
 */
export const Contact: React.FC = () => {
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
    <div className="contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <motion.div
            className="contact-hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="contact-hero__title">How Can We Help?</h1>
            <p className="contact-hero__subtitle">
              Contact us today and let us know how we can help you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <motion.div
            className="contact-content__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Contact Information */}
            <motion.div className="contact-info" variants={itemVariants}>
              <h2 className="contact-info__title">Visit Our Store</h2>
              
              <div className="contact-info__content">
                <div className="contact-info__item">
                  <div className="contact-info__icon">📍</div>
                  <div className="contact-info__details">
                    <h3 className="contact-info__item-title">Address</h3>
                    <p className="contact-info__item-text">
                      {import.meta.env.VITE_MARKET_ADDRESS || '3811 S. Harlem Ave, Berwyn, IL 60402'}
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon">📞</div>
                  <div className="contact-info__details">
                    <h3 className="contact-info__item-title">Phone</h3>
                    <p className="contact-info__item-text">
                      <a href={`tel:${import.meta.env.VITE_MARKET_PHONE || '(708) 795-6670'}`}>
                        {import.meta.env.VITE_MARKET_PHONE || '(708) 795-6670'}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email removed per request */}

                <div className="contact-info__item">
                  <div className="contact-info__icon">🕒</div>
                  <div className="contact-info__details">
                    <h3 className="contact-info__item-title">Store Hours</h3>
                    <div className="contact-info__hours">
                      <div className="contact-info__hours-item">
                        <span>Monday - Friday</span>
                        <span>7:30 AM - 9:00 PM</span>
                      </div>
                      <div className="contact-info__hours-item">
                        <span>Saturday - Sunday</span>
                        <span>7:00 AM - 9:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="contact-info__map">
                <iframe
                  title="Berwyn Fruit Market Location Map"
                  className="contact-info__map-iframe"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(import.meta.env.VITE_MARKET_ADDRESS || '3811 S. Harlem Ave, Berwyn, IL 60402')}&output=embed`}
                />
                <div className="contact-info__map-actions">
                  <a
                    className="btn btn--secondary"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(import.meta.env.VITE_MARKET_ADDRESS || '3811 S. Harlem Ave, Berwyn, IL 60402')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
