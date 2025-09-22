import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface HomeSlideshowProps {
  images?: string[]; // explicit list of image URLs under public
  intervalMs?: number;
  className?: string;
}

export const HomeSlideshow: React.FC<HomeSlideshowProps> = ({
  images,
  intervalMs = 3500,
  className,
}) => {
  const imageUrls = useMemo(() => {
    if (images && images.length > 0) return images;
    // Default: look for exactly 7 images provided by user
    return [
      '/home-slide-1.jpg',
      '/home-slide-2.jpg',
      '/home-slide-3.jpg',
      '/home-slide-4.jpg',
      '/home-slide-5.jpg',
      '/home-slide-6.jpg',
      '/home-slide-7.jpg',
    ];
  }, [images]);

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const nextIndex = (index + 1) % imageUrls.length;
  const [pausedUntil, setPausedUntil] = useState<number>(0);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [dotShift, setDotShift] = useState<number>(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const timer = setInterval(() => {
      if (!isSliding && Date.now() >= pausedUntil) {
        setDirection('forward');
        setIndex(i => {
          setPrevIndex(i);
          return (i + 1) % imageUrls.length;
        });
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [imageUrls.length, intervalMs, pausedUntil, isSliding]);

  // Make bubbles scroll one slot smoothly per change (like a wheel)
  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const forward = ((index - prevIndex + imageUrls.length) % imageUrls.length) === 1;
    const STEP = 20; // pixel distance per slot (gap + dot size)
    setDotShift(forward ? -STEP : STEP);
    const t = setTimeout(() => setDotShift(0), 220);
    return () => clearTimeout(t);
  }, [index, prevIndex, imageUrls.length]);

  // No pre-active phase; keep bubbles smooth with layout transitions only

  const pauseAuto = () => setPausedUntil(Date.now() + 3000);

  const slideToIndex = (target: number) => {
    if (isSliding) return;
    setIsSliding(true);
    pauseAuto();
    setIndex(i => {
      setPrevIndex(i);
      const normalizedTarget = ((target % imageUrls.length) + imageUrls.length) % imageUrls.length;
      return normalizedTarget;
    });
    // release lock slightly after image transition (0.8s)
    const unlockMs = 820;
    setTimeout(() => setIsSliding(false), unlockMs);
  };

  const goPrev = () => {
    if (isSliding) return;
    setDirection('backward');
    slideToIndex(index - 1);
  };
  const goNext = () => {
    if (isSliding) return;
    setDirection('forward');
    slideToIndex(index + 1);
  };

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Leaving (previous) image */}
      <motion.img
        key={`leave-${imageUrls[prevIndex]}-${direction}`}
        src={imageUrls[prevIndex]}
        alt="home slide previous"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: direction === 'forward' ? '-100%' : '100%' }}
        transition={{ duration: 0.8 }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src.endsWith('.jpg')) target.src = target.src.replace('.jpg', '.png');
        }}
      />
      {/* Entering (current) image */}
      <motion.img
        key={`enter-${imageUrls[index]}-${direction}`}
        src={imageUrls[index]}
        alt="home slide"
        initial={{ x: direction === 'forward' ? '100%' : '-100%', opacity: 1 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src.endsWith('.jpg')) target.src = target.src.replace('.jpg', '.png');
        }}
      />

      {/* Controls (arrows) */}
      {imageUrls.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className="home-slide__control home-slide__control--prev"
            disabled={isSliding}
          >
            <svg className="home-slide__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={goNext}
            className="home-slide__control home-slide__control--next"
            disabled={isSliding}
          >
            <svg className="home-slide__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </>
      )}

      {/* Bubbles removed as requested */}
    </div>
  );
};

export default HomeSlideshow;


