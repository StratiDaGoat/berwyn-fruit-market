import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Products.scss';

export const WeeklyAds: React.FC = () => {
  const [pdfTimestamp, setPdfTimestamp] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);

  // Refresh PDF when component mounts to ensure latest version loads
  useEffect(() => {
    setPdfTimestamp(Date.now());
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768; // $breakpoint-md
      setIsMobile(isMobileDevice);
    };
    
    // Check immediately
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Also check on focus (when user comes back to tab)
    window.addEventListener('focus', checkMobile);
    
    // Check on visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('focus', checkMobile);
      document.removeEventListener('visibilitychange', checkMobile);
    };
  }, []);

  // Force mobile check on every render
  const currentIsMobile = window.innerWidth < 768;
  if (currentIsMobile !== isMobile) {
    setIsMobile(currentIsMobile);
  }

  const handlePrint = () => {
    // Open the single PDF file for printing
    const printWindow = window.open('/weekly-ad.pdf', '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }
  };

  const handleDownload = () => {
    // Download the single PDF file
    try {
      const link = document.createElement('a');
      link.href = '/weekly-ad.pdf';
      link.download = 'weekly-specials.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Fallback: open PDF in new tab
      window.open('/weekly-ad.pdf', '_blank');
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
            {/* Hide buttons on mobile */}
            <div className="weekly-specials__actions">
              <button
                className="btn btn--primary weekly-specials__action-btn"
                onClick={handlePrint}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 18H4C2.9 18 2 17.1 2 16V11C2 9.9 2.9 9 4 9H20C21.1 9 22 9.9 22 11V16C22 17.1 21.1 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 14H18V22H6V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Print Specials
              </button>
              <button
                className="btn btn--secondary weekly-specials__action-btn"
                onClick={handleDownload}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download
              </button>
            </div>

             <div className="weekly-specials__pdf-container">
               {/* Side-by-side PDF viewers for both mobile and web */}
               {isMobile ? (
                 // Mobile PDF viewer - side by side
                 <div className="weekly-specials__pdf-viewer weekly-specials__pdf-viewer--mobile">
                   <div className="weekly-specials__pdf-page">
                     <iframe
                       src={`/weekly-ad-1.pdf?t=${pdfTimestamp}#toolbar=0&navpanes=0&scrollbar=0&view=FitV&pagemode=none&zoom=60&disableScroll=1`}
                       title="Weekly Specials PDF - Page 1"
                       className="weekly-specials__pdf-iframe"
                       loading="lazy"
                       key={`${pdfTimestamp}-1-mobile`}
                       style={{
                         width: '100%',
                         height: '100%',
                         border: 'none',
                         display: 'block',
                         background: 'transparent',
                         margin: 0,
                         padding: 0,
                         overflow: 'hidden'
                       }}
                       scrolling="no"
                     />
                   </div>
                   <div className="weekly-specials__pdf-page">
                     <iframe
                       src={`/weekly-ad-2.pdf?t=${pdfTimestamp}#toolbar=0&navpanes=0&scrollbar=0&view=FitV&pagemode=none&zoom=60&disableScroll=1`}
                       title="Weekly Specials PDF - Page 2"
                       className="weekly-specials__pdf-iframe"
                       loading="lazy"
                       key={`${pdfTimestamp}-2-mobile`}
                       style={{
                         width: '100%',
                         height: '100%',
                         border: 'none',
                         display: 'block',
                         background: 'transparent',
                         margin: 0,
                         padding: 0,
                         overflow: 'hidden'
                       }}
                       scrolling="no"
                     />
                   </div>
                 </div>
               ) : (
                 // Web PDF viewer - side by side
                 <div className="weekly-specials__pdf-viewer weekly-specials__pdf-viewer--web">
                   <div className="weekly-specials__pdf-page">
                     <iframe
                       src={`/weekly-ad-1.pdf?t=${pdfTimestamp}#toolbar=0&navpanes=0&scrollbar=0&view=FitV&pagemode=none&zoom=60&disableScroll=1`}
                       title="Weekly Specials PDF - Page 1"
                       className="weekly-specials__pdf-iframe"
                       loading="lazy"
                       key={`${pdfTimestamp}-1-web`}
                       style={{
                         width: '100%',
                         height: '100%',
                         border: 'none',
                         display: 'block',
                         background: 'transparent',
                         margin: 0,
                         padding: 0,
                         overflow: 'hidden'
                       }}
                       scrolling="no"
                     />
                   </div>
                   <div className="weekly-specials__pdf-page">
                     <iframe
                       src={`/weekly-ad-2.pdf?t=${pdfTimestamp}#toolbar=0&navpanes=0&scrollbar=0&view=FitV&pagemode=none&zoom=60&disableScroll=1`}
                       title="Weekly Specials PDF - Page 2"
                       className="weekly-specials__pdf-iframe"
                       loading="lazy"
                       key={`${pdfTimestamp}-2-web`}
                       style={{
                         width: '100%',
                         height: '100%',
                         border: 'none',
                         display: 'block',
                         background: 'transparent',
                         margin: 0,
                         padding: 0,
                         overflow: 'hidden'
                       }}
                       scrolling="no"
                     />
                   </div>
                 </div>
               )}
             </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};


