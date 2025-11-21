import React, { useEffect } from 'react';
import './WeeklyAdImages.scss';

interface WeeklyAdImagesProps {
  className?: string;
}

export const WeeklyAdImages: React.FC<WeeklyAdImagesProps> = ({ className = '' }) => {
  const adImages = [
    {
      src: '/weekly-ad-47-1.jpg',
      alt: 'Weekly Ad - 47 Page 1',
      title: 'Weekly Specials 47 Page 1'
    },
    {
      src: '/weekly-ad-47-2.jpg',
      alt: 'Weekly Ad - 47 Page 2',
      title: 'Weekly Specials 47 Page 2'
    }
  ];

  // Preload all images immediately on mount for instant mobile loading
  useEffect(() => {
    const imageUrls = ['/weekly-ad-47-1.jpg', '/weekly-ad-47-2.jpg'];
    
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.loading = 'eager';
      // @ts-ignore - fetchPriority may not be in all TypeScript versions
      img.fetchPriority = 'high';
    });
  }, []);

  return (
    <div className={`weekly-ad-images ${className}`}>
      <div className="weekly-ad-images__container">
        {adImages.map((ad, index) => (
          <div key={index} className="weekly-ad-images__item">
            <img
              src={ad.src}
              alt={ad.alt}
              title={ad.title}
              className="weekly-ad-images__image"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyAdImages;
