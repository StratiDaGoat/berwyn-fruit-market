import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.scss';

/**
 * Header component with navigation and mobile menu
 * Features responsive design with animated mobile menu
 */
export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/weekly-ad', label: 'Weekly Specials' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          {/* Logo */}
          <Link 
            to="/" 
            className="header__logo" 
            onClick={() => {
              closeMobileMenu();
              window.scrollTo(0, 0);
            }}
          >
            <motion.div
              className="header__logo-icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/logo.png"
                alt="Berwyn Fruit Market Logo"
                className="header__logo-image"
              />
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.span
              className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}
              animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
            />
            <motion.span
              className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
            />
            <motion.span
              className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}
              animate={{ rotate: isMobileMenuOpen ? -45 : 0 }}
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="header__nav header__nav--desktop">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`header__nav-link ${
                  location.pathname === item.path ? 'header__nav-link--active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="header__nav header__nav--mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`header__nav-link ${
                      location.pathname === item.path ? 'header__nav-link--active' : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
