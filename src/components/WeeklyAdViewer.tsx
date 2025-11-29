import React, { useState, useEffect } from 'react';
import './WeeklyAdViewer.scss';

interface WeeklyAdViewerProps {
  className?: string;
}

export const WeeklyAdViewer: React.FC<WeeklyAdViewerProps> = ({
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [useImageFallback, setUseImageFallback] = useState(false);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Check if PDF embedding is supported and working
  useEffect(() => {
    const checkPDFSupport = () => {
      // For Safari and mobile browsers, prefer image fallback
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isMobileBrowser =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isSafari || isMobileBrowser) {
        setUseImageFallback(true);
      }
    };

    checkPDFSupport();
  }, []);

  const pdfFiles = [
    { pdf: '/weekly-ad-47.pdf', image: '/weekly-ad-47-1.webp' },
    { pdf: '/weekly-ad-47.pdf', image: '/weekly-ad-47-2.webp' },
  ];

  const renderPDF = (pdfPath: string, imagePath: string, index: number) => {
    if (useImageFallback) {
      return (
        <img
          src={imagePath}
          alt={`Weekly Ad Page ${index + 1}`}
          className="weekly-ad__image"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
          onError={() => {
            // If image fails, try PDF as last resort
            setUseImageFallback(false);
          }}
        />
      );
    }

    return (
      <object
        data={`${pdfPath}#zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`}
        type="application/pdf"
        className="weekly-ad__pdf"
        style={{
          width: '100%',
          height: isMobile ? '100dvh' : 'auto',
          minHeight: isMobile ? '400px' : '600px',
          border: 'none',
          display: 'block',
        }}
      >
        {/* Fallback content */}
        <div className="weekly-ad-viewer__error">
          <p>We couldn&apos;t load the weekly ad. Please try again later.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </object>
    );
  };

  const getLayoutClass = () => {
    if (isMobile) return 'weekly-ad--mobile';
    if (isTablet) return 'weekly-ad--tablet';
    return 'weekly-ad--desktop';
  };

  return (
    <div className={`weekly-ad ${getLayoutClass()} ${className}`}>
      <div className="weekly-ad__container">
        {pdfFiles.map((file, index) => (
          <div key={index} className="weekly-ad__page">
            {renderPDF(file.pdf, file.image, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyAdViewer;
