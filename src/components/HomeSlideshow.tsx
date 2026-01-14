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
    // Default: include home slides 1-11 (now in WebP format)
    return [
      '/home-slide-1.webp',
      '/home-slide-2.webp',
      '/home-slide-3.webp',
      '/home-slide-4.webp',
      '/home-slide-5.webp',
      '/home-slide-6.webp',
      '/home-slide-7.webp',
      '/home-slide-8.webp',
      '/home-slide-9.webp',
      '/home-slide-10.webp',
      '/home-slide-11.webp',
    ];
  }, [images]);

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isReady, setIsReady] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Auto-advance timer - works on both desktop and mobile
  useEffect(() => {
    if (imageUrls.length <= 1) return;
    if (!isReady) return;

    const timer = setInterval(() => {
      setIsInitialRender(false);
      setDirection('forward');
      setIndex(i => {
        setPrevIndex(i);
        return (i + 1) % imageUrls.length;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [imageUrls.length, intervalMs, isReady]);

  // Simple ready state - images will load via native lazy loading
  useEffect(() => {
    // Mark as ready immediately - browser handles image loading
    setIsReady(true);
    setIsInitialRender(false);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          willChange: 'contents',
        }}
      >
        {/* Loading skeleton - shown while image is loading (handled by onLoad if needed, but for LCP we want img tag immediately) */}
        {/* Removed blocking skeleton to allow immediate LCP image discovery */}

        {/* Show static first image immediately for LCP */}
        {(!isReady || (isInitialRender && index === 0)) && (
          <img
            key={`static-${imageUrls[0]}`}
            src={imageUrls[0]}
            alt="home slide"
            width="1920"
            height="1080"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: isInitialRender && index === 0 ? 2 : 1,
              animation: 'fadeIn 0.5s ease-in',
            }}
            draggable={false}
            loading="eager"
            fetchPriority="high"
          />
        )}
        {/* Previous image (leaving) */}
        {isReady && prevIndex !== index && (
          <motion.img
            key={`leave-${imageUrls[prevIndex]}-${direction}`}
            src={imageUrls[prevIndex]}
            alt="home slide previous"
            width="1920"
            height="1080"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: direction === 'forward' ? '-100%' : '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              willChange: 'transform',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000,
            }}
            draggable={false}
            loading="lazy"

          />
        )}
        {/* Current image (entering) */}
        {isReady && (
          <motion.img
            key={`enter-${imageUrls[index]}-${direction}`}
            src={imageUrls[index]}
            alt="home slide"
            width="1920"
            height="1080"
            initial={
              isInitialRender && index === 0
                ? { x: 0, opacity: 1 }
                : { x: direction === 'forward' ? '100%' : '-100%', opacity: 1 }
            }
            animate={{ x: 0 }}
            transition={
              isInitialRender && index === 0
                ? { duration: 0 }
                : { duration: 0.8, ease: 'easeInOut' }
            }
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              willChange: 'transform',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000,
            }}
            draggable={false}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}

          />
        )}

        {/* No controls - auto-advance only */}
      </div>
    </>
  );
};

export default HomeSlideshow;
