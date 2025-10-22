import React from 'react';
import './WeeklyAdImages.scss';

interface WeeklyAdImagesProps {
  className?: string;
}

export const WeeklyAdImages: React.FC<WeeklyAdImagesProps> = ({ className = '' }) => {
  const adImages = [
    {
      src: '/weekly-ad-1.jpg',
      alt: 'Weekly Ad - Page 1',
      title: 'Weekly Specials Page 1'
    },
    {
      src: '/weekly-ad-2.jpg',
      alt: 'Weekly Ad - Page 2',
      title: 'Weekly Specials Page 2'
    }
  ];

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
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyAdImages;
