import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface DepartmentSlideshowProps {
  departmentId: string; // e.g., 'meat'
  imageCount?: number; // used when images not provided
  images?: string[]; // explicit list of image paths under public/
  intervalMs?: number;
  className?: string;
}

const shuffleArray = (arr: number[]): number[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const DepartmentSlideshow: React.FC<DepartmentSlideshowProps> = ({
  departmentId,
  imageCount = 1,
  images,
  intervalMs = 3500,
  className,
}) => {
  const imageUrls = useMemo(() => {
    if (images && images.length > 0) return images;
    // default pattern (backward compatible): /departments/{id}-{index}.jpg
    return Array.from(
      { length: imageCount },
      (_, i) => `/departments/${departmentId}-${i + 1}.jpg`
    );
  }, [departmentId, imageCount, images]);

  const indexes = useMemo(
    () => Array.from({ length: imageUrls.length }, (_, i) => i),
    [imageUrls.length]
  );
  const [order, setOrder] = useState<number[]>(() => shuffleArray(indexes));
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);

  useEffect(() => {
    if (imageUrls.length <= 1) return; // no rotation needed
    const timer = setInterval(() => {
      setPrevIdx(currentIdx);
      setCurrentIdx(prev => (prev + 1) % order.length);
      // After cycling through all, reshuffle to avoid repeating predictable order
      if ((currentIdx + 1) % order.length === 0) {
        setOrder(prev => shuffleArray(prev));
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [imageUrls.length, intervalMs, order.length, currentIdx]);

  const activeIndex = order[currentIdx] ?? 0;
  const src = imageUrls[activeIndex];
  const prevActive = prevIdx !== null ? order[prevIdx] : null;
  const prevSrc = prevActive !== null ? imageUrls[prevActive] : null;

  return (
    <div
      className={className}
      aria-label={`${departmentId} slideshow`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {prevSrc && (
        <motion.img
          key={`prev-${prevSrc}`}
          src={prevSrc}
          alt="previous"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={e => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src.endsWith('.jpg')) {
              target.src = target.src.replace('.jpg', '.png');
            } else if (target.src.endsWith('.png')) {
              target.src = '/departments/placeholder.svg';
            }
          }}
        />
      )}
      <motion.img
        key={`curr-${src}`}
        src={src}
        alt={`${departmentId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={e => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src.endsWith('.jpg')) {
            target.src = target.src.replace('.jpg', '.png');
          } else if (target.src.endsWith('.png')) {
            target.src = '/departments/placeholder.svg';
          }
        }}
      />
    </div>
  );
};

export default DepartmentSlideshow;
