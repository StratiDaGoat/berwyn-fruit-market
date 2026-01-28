import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WeeklyAdImages from '../components/WeeklyAdImages';
import './Products.scss';

export const WeeklyAds: React.FC = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );

  // Check device type on mount and resize
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const isTablet =
        /iPad|Android/i.test(navigator.userAgent) &&
        width >= 768 &&
        width < 1024;
      const isMobile =
        width < 768 ||
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      let deviceType: 'mobile' | 'tablet' | 'desktop';
      if (isMobile) {
        deviceType = 'mobile';
      } else if (isTablet || (width >= 768 && width < 1024)) {
        deviceType = 'tablet'; // iPad Air, iPad Mini, etc.
      } else {
        deviceType = 'desktop';
      }

      setDeviceType(deviceType);
    };

    // Check immediately
    checkDeviceType();

    // Add resize listener
    window.addEventListener('resize', checkDeviceType);

    // Also check on focus (when user comes back to tab)
    window.addEventListener('focus', checkDeviceType);

    // Check on visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', checkDeviceType);

    return () => {
      window.removeEventListener('resize', checkDeviceType);
      window.removeEventListener('focus', checkDeviceType);
      document.removeEventListener('visibilitychange', checkDeviceType);
    };
  }, []);

  // Force device type check on every render
  const currentDeviceType = (() => {
    const width = window.innerWidth;
    const isTablet =
      /iPad|Android/i.test(navigator.userAgent) && width >= 768 && width < 1024;
    const isMobile =
      width < 768 ||
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) return 'mobile';
    if (isTablet || (width >= 768 && width < 1024)) return 'tablet';
    return 'desktop';
  })();

  if (currentDeviceType !== deviceType) {
    setDeviceType(currentDeviceType);
  }

  const handlePrint = () => {
    // Open the Week 5 PDF file for printing
    const printWindow = window.open('/weekly-ad-week-5.pdf', '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
  };

  const handleDownload = () => {
    // Download the Week 5 PDF file
    try {
      const link = document.createElement('a');
      link.href = '/weekly-ad-week-5.pdf';
      link.download = 'weekly-specials-week5.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback: open PDF in new tab
      window.open('/weekly-ad-week-5.pdf', '_blank');
    }
  };

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
            <h1 className="departments-hero__title">Weekly Specials</h1>
            <p className="departments-hero__subtitle">
              Check out our latest weekly specials and promotions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="weekly-specials-content">
        <div className="container">
          <motion.div
            className="weekly-specials__card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Hide buttons on mobile and tablet */}
            {deviceType === 'desktop' && (
              <div className="weekly-specials__actions">
                <button
                  className="btn btn--primary weekly-specials__action-btn"
                  onClick={handlePrint}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9V2H18V9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 18H4C2.9 18 2 17.1 2 16V11C2 9.9 2.9 9 4 9H20C21.1 9 22 9.9 22 11V16C22 17.1 21.1 18 20 18H18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 14H18V22H6V14Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Print Specials
                </button>
                <button
                  className="btn btn--secondary weekly-specials__action-btn"
                  onClick={handleDownload}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15V3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download
                </button>
              </div>
            )}

            <div className="weekly-specials__pdf-container">
              {/* Use the new WeeklyAdImages component */}
              <WeeklyAdImages />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
