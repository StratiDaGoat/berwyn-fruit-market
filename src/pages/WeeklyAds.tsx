import React from 'react';
import { motion } from 'framer-motion';
import './Products.scss';

export const WeeklyAds: React.FC = () => {
  return (
    <div className="departments">
      <section className="departments-hero">
        <div className="container">
          <motion.div
            className="departments-hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="departments-hero__title">Weekly Ads</h1>
            <p className="departments-hero__subtitle">
              Store owners can post weekly specials and promotions here.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="departments-grid">
        <div className="container">
          <div className="departments-grid__content">
            <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
              <p>Coming soon: upload weekly flyers and featured deals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


