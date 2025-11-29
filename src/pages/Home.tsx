import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.scss';
import { HomeSlideshow } from '../components/HomeSlideshow';
import { departments } from '../data/departments';

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

  const total = departments.length;
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );
  const [showOverlay, setShowOverlay] = useState(true);

  // Determine visible departments based on device type
  const visible = deviceType === 'mobile' ? 1 : deviceType === 'tablet' ? 2 : 3;

  const CLONES = 50; // large buffer to avoid any perceived snapping
  const centerBlock = Math.floor(CLONES / 2);
  const loopItems = useMemo(
    () => Array.from({ length: CLONES }).flatMap(() => departments),
    []
  );
  const [startIndex, setStartIndex] = useState(total * centerBlock);
  const [isSnapping, setIsSnapping] = useState(false);

  // Handle scroll to hide/show overlay
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        setShowOverlay(false);
      } else if (scrollY < 5) {
        setShowOverlay(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check device type on mount and resize
  React.useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet'); // iPad Mini and similar tablets
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);
  const handlePrev = () => {
    // Move by 1 department at a time
    setStartIndex(prev => prev - 1);
  };
  const handleNext = () => {
    // Move by 1 department at a time
    setStartIndex(prev => prev + 1);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <HomeSlideshow />
        </div>
        <div className="container">
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: showOverlay ? 1 : 0,
              y: showOverlay ? 0 : -30,
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.h2
              className="hero__welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to
            </motion.h2>

            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Berwyn Fruit Market
            </motion.h1>

            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your neighborhood fresh market & quality butcher shop
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/weekly-ad" className="btn btn--primary btn--large">
                View Weekly Specials
              </Link>
              <Link to="/about" className="btn btn--secondary btn--large">
                Learn About Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Departments Carousel Section */}
      <section className="home-departments">
        <div className="container">
          <motion.div
            className="home-departments__carousel"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="home-departments__controls" aria-hidden="false">
              <button
                className="home-departments__control home-departments__control--prev"
                onClick={handlePrev}
                aria-label="Previous departments"
              >
                <svg
                  className="home-departments__icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button
                className="home-departments__control home-departments__control--next"
                onClick={handleNext}
                aria-label="Next departments"
              >
                <svg
                  className="home-departments__icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div
              className="home-departments__track"
              id="home-dept-track"
              aria-live="polite"
            >
              <div
                className="home-departments__group"
                style={{
                  transform: `translateX(-${startIndex * (100 / visible)}%)`,
                  transition: isSnapping ? 'none' : undefined,
                }}
                onTransitionEnd={() => {
                  // With many clones, only snap when extremely far from center
                  const leftThreshold = total * 2; // generous buffer
                  const rightThreshold = total * (CLONES - 2) - visible; // generous buffer on right
                  if (startIndex > rightThreshold) {
                    const normalized =
                      (((startIndex - total * centerBlock) % total) + total) %
                      total;
                    setIsSnapping(true);
                    setStartIndex(total * centerBlock + normalized);
                    requestAnimationFrame(() => setIsSnapping(false));
                  } else if (startIndex < leftThreshold) {
                    const normalized =
                      (((startIndex - total * centerBlock) % total) + total) %
                      total;
                    setIsSnapping(true);
                    setStartIndex(total * centerBlock + normalized);
                    requestAnimationFrame(() => setIsSnapping(false));
                  }
                }}
              >
                {loopItems.map((department, idx) => (
                  <div
                    key={`${department.id}-${idx}`}
                    className="home-departments__slide"
                  >
                    <div className="department-card">
                      <div className="department-card__header department-card__header--media">
                        <img
                          src={department.images[0]}
                          alt={department.name}
                          className="department-card__media"
                          loading="lazy"
                          width="400"
                          height="225"
                          style={{ aspectRatio: '16/9' }}
                        />
                        <h3 className="department-card__title">
                          {department.name}
                        </h3>
                      </div>
                      <div className="department-card__content">
                        {(() => {
                          const full = department.description || '';
                          const firstSentence =
                            full.split('. ')[0] +
                            (full.includes('. ') ? '.' : '');
                          const maxLen = 90;
                          const trimmed =
                            firstSentence.length > maxLen
                              ? firstSentence.slice(0, maxLen - 1).trimEnd() +
                              '…'
                              : firstSentence;
                          return (
                            <p className="department-card__description">
                              {trimmed}
                            </p>
                          );
                        })()}
                        <div className="department-card__features">
                          {department.features.map((feature, index) => (
                            <span
                              key={index}
                              className="department-card__feature"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
