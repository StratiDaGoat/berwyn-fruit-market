import React, { useEffect } from 'react';
import { getCurrentWeeklyAdWeek, WEEKLY_AD_ASSETS } from '../utils/weeklyAdSchedule';
import './WeeklyAdImages.scss';

interface WeeklyAdImagesProps {
  className?: string;
}

export const WeeklyAdImages: React.FC<WeeklyAdImagesProps> = ({
  className = '',
}) => {
  const week = getCurrentWeeklyAdWeek();
  const assets = WEEKLY_AD_ASSETS[week];
  const adImages = [
    { src: assets.images[0], alt: 'Weekly Ad Page 1', page: 1 },
    { src: assets.images[1], alt: 'Weekly Ad Page 2', page: 2 },
  ];

  useEffect(() => {
    assets.images.forEach(url => {
      const img = new Image();
      img.src = url;
      img.loading = 'eager';
      (img as HTMLImageElement).fetchPriority = 'high';
    });
  }, [week]);

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
