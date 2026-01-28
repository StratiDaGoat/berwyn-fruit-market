import React, { useEffect } from 'react';
import './WeeklyAdImages.scss';

interface WeeklyAdImagesProps {
  className?: string;
}

export const WeeklyAdImages: React.FC<WeeklyAdImagesProps> = ({
  className = '',
}) => {
  const adImages = [
    {
      src: '/weekly-ad-week-5-1.webp',
      alt: 'Weekly Ad Page 1',
      page: 1,
    },
    {
      src: '/weekly-ad-week-5-2.webp',
      alt: 'Weekly Ad Page 2',
      page: 2,
    },
  ];

  // Preload all images immediately on mount for instant mobile loading
  useEffect(() => {
    const imageUrls = ['/weekly-ad-week-5-1.webp', '/weekly-ad-week-5-2.webp'];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.loading = 'eager';

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
              className="weekly-ad-images__image"
              loading="lazy"
              width="2550"
              height="3300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyAdImages;
