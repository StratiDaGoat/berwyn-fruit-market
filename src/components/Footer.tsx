import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.scss';

/**
 * Footer component with contact information and social links
 * Features responsive design with animated elements
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();


  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/weekly-ad', label: 'Weekly Specials' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/berwynfruitmarket',
      icon: 'fab fa-facebook-f'
    },
    {
      name: 'Instagram', 
      url: 'https://www.instagram.com/berwynfruit/',
      icon: 'fab fa-instagram'
    }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* Company Info */}
          <motion.div
            className="footer__section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <img 
                  src="/logo.png" 
                  alt="Berwyn Fruit Market Logo" 
                  className="footer__logo-image"
                />
              </div>
              <h3 className="footer__logo-text">Berwyn Fruit Market</h3>
            </div>
            <p className="footer__description">
              Your local community market for the freshest fruits and vegetables. 
              We're committed to bringing you premium quality produce and friendly service.
            </p>
            <div className="footer__contact">
              <p className="footer__contact-item">
                <span className="footer__contact-icon">📍</span>
                {import.meta.env.VITE_MARKET_ADDRESS || '3811 S. Harlem Ave, Berwyn, IL 60402'}
              </p>
              <p className="footer__contact-item">
                <span className="footer__contact-icon">📞</span>
                {import.meta.env.VITE_MARKET_PHONE || '(708) 795-6670'}
              </p>
              {/* Email removed per request */}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="footer__section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="footer__section-title">Quick Links</h4>
            <nav className="footer__nav">
              {quickLinks.map((link) => (
                <Link key={link.path} to={link.path} className="footer__nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Social Links - Inline with Quick Links */}
            <div className="footer__social-inline">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  className="footer__social-link-inline"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            className="footer__section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="footer__section-title">Store Hours</h4>
            <div className="footer__hours">
              <div className="footer__hours-item">
                <span className="footer__hours-day">Monday - Friday</span>
                <span className="footer__hours-time">7:30 AM - 9:00 PM</span>
              </div>
              <div className="footer__hours-item">
                <span className="footer__hours-day">Saturday - Sunday</span>
                <span className="footer__hours-time">7:00 AM - 9:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="footer__bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="footer__copyright">
            © {currentYear} Berwyn Fruit Market. All rights reserved.
          </p>
          <p className="footer__tagline">
            Fresh • Local • Community
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
