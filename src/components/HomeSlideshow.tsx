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
  const [isFirstImageReady, setIsFirstImageReady] = useState(false);
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
    setIsFirstImageReady(true);
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
        {/* Loading skeleton - shown before first image loads */}
        {!isFirstImageReady && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#9e9e9e',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #e0e0e0',
                  borderTop: '4px solid #4caf50',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px',
                }}
              />
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>
                Loading images...
              </p>
            </div>
          </div>
        )}
        {/* Show static first image until slideshow is ready */}
        {(!isReady || (isInitialRender && index === 0)) &&
          isFirstImageReady && (
            <img
              key={`static-${imageUrls[0]}`}
              src={imageUrls[0]}
              alt="home slide"
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
