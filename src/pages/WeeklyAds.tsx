import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Products.scss';

export const WeeklyAds: React.FC = () => {
  const [pdfTimestamp, setPdfTimestamp] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const totalPages = 2; // Assuming the weekly ad has 2 pages

  // Refresh PDF when component mounts to ensure latest version loads
  useEffect(() => {
    setPdfTimestamp(Date.now());
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // $breakpoint-md
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrint = () => {
    // Open the PDF file in a new window for printing
    const printWindow = window.open('/weekly-ad.pdf', '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDownload = () => {
    // Create a download link for the PDF file
    const link = document.createElement('a');
    link.href = '/weekly-ad.pdf';
    link.download = 'weekly-ad.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
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
            <h1 className="departments-hero__title">Weekly Ad</h1>
            <p className="departments-hero__subtitle">
              Check out our latest weekly specials and promotions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="weekly-ad-content">
        <div className="container">
          <motion.div
            className="weekly-ad__card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="weekly-ad__actions">
              <button 
                className="btn btn--primary weekly-ad__action-btn"
                onClick={handlePrint}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 18H4C2.9 18 2 17.1 2 16V11C2 9.9 2.9 9 4 9H20C21.1 9 22 9.9 22 11V16C22 17.1 21.1 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 14H18V22H6V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Print Ad
              </button>
              <button 
                className="btn btn--secondary weekly-ad__action-btn"
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

            <div className="weekly-ad__pdf-container">
              {/* Separate PDF viewers for mobile and web */}
              {isMobile ? (
                // Mobile PDF viewer
                <div className="weekly-ad__pdf-viewer weekly-ad__pdf-viewer--mobile">
                  <iframe
                    src={`/weekly-ad-${currentPage}.pdf?t=${pdfTimestamp}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&pagemode=none&zoom=100`}
                    title={`Weekly Ad PDF - Page ${currentPage}`}
                    className="weekly-ad__pdf-iframe"
                    loading="lazy"
                    key={`${pdfTimestamp}-${currentPage}-mobile`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block',
                      background: 'transparent',
                      margin: 0,
                      padding: 0
                    }}
                  />
                </div>
              ) : (
                // Web PDF viewer
                <div className="weekly-ad__pdf-viewer weekly-ad__pdf-viewer--web">
                  <iframe
                    src={`/weekly-ad-${currentPage}.pdf?t=${pdfTimestamp}#toolbar=0&navpanes=0&scrollbar=0&view=FitV&pagemode=none&zoom=100`}
                    title={`Weekly Ad PDF - Page ${currentPage}`}
                    className="weekly-ad__pdf-iframe"
                    loading="lazy"
                    key={`${pdfTimestamp}-${currentPage}-web`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block',
                      background: 'transparent',
                      margin: 0,
                      padding: 0
                    }}
                  />
                </div>
              )}
              
              {/* Page Navigation - Show on both desktop and mobile */}
              <div className="weekly-ad__page-nav">
                <button 
                  className="btn btn--secondary weekly-ad__nav-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>
                
                <span className="weekly-ad__page-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  className="btn btn--primary weekly-ad__nav-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};


