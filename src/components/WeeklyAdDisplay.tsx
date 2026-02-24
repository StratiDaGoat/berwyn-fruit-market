import React, { useState, useEffect } from 'react';
import { getCurrentWeeklyAdWeek, WEEKLY_AD_ASSETS } from '../utils/weeklyAdSchedule';
import './WeeklyAdDisplay.scss';

interface WeeklyAdDisplayProps {
  className?: string;
}

export const WeeklyAdDisplay: React.FC<WeeklyAdDisplayProps> = ({
  className = '',
}) => {
  const [useImageFallback, setUseImageFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [week, setWeek] = useState(getCurrentWeeklyAdWeek);
  const assets = WEEKLY_AD_ASSETS[week];
  const adFiles = [
    { pdf: assets.pdf, image: assets.images[0], alt: 'Weekly Ad Page 1' },
    { pdf: assets.pdf, image: assets.images[1], alt: 'Weekly Ad Page 2' },
  ];

  useEffect(() => {
    const check = () => setWeek(getCurrentWeeklyAdWeek());
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const checkFallback = () => {
      const isMobile = window.innerWidth < 768;
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isMobile && (isSafari || isIOS)) {
        setUseImageFallback(true);
      }
    };

    checkFallback();
    setIsLoading(false);
  }, []);

  const renderAd = (file: (typeof adFiles)[0]) => {
    if (useImageFallback) {
      return (
        <img
          src={file.image}
          alt={file.alt}
          className="weekly-ad__image"
          loading="lazy"
          width="2550"
          height="3300"
          onError={() => {
            // If image fails, try PDF as last resort
            setUseImageFallback(false);
          }}
        />
      );
    }

    return (
      <object
        data={`${file.pdf}#zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0&pagemode=none`}
        type="application/pdf"
        className="weekly-ad__pdf"
        aria-label={file.alt}
      >
        {/* Fallback content */}
        <div className="weekly-ad__fallback">
          <p>PDF viewer not supported. Loading image version...</p>
          <img
            src={file.image}
            alt={file.alt}
            className="weekly-ad__fallback-image"
            onLoad={() => setUseImageFallback(true)}
          />
        </div>
      </object>
    );
  };

  if (isLoading) {
    return (
      <div className={`weekly-ad ${className}`}>
        <div className="weekly-ad__loading">
          <p>Loading weekly ads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`weekly-ad ${className}`}>
      <div className="weekly-ad__container">
        {adFiles.map((file, index) => (
          <div key={index} className="weekly-ad__page">
            {renderAd(file)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyAdDisplay;
