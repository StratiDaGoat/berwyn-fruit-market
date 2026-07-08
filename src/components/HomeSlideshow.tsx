import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_SLIDES = Array.from({ length: 11 }, (_, i) => {
  const n = i + 1;
  return `/home-slide-${n}.webp`;
});

interface HomeSlideshowProps {
  images?: string[];
  intervalMs?: number;
  className?: string;
  showControls?: boolean;
}

export const HomeSlideshow: React.FC<HomeSlideshowProps> = ({
  images,
  intervalMs = 3500,
  className,
  showControls = false,
}) => {
  const imageUrls = useMemo(
    () => (images && images.length > 0 ? images : DEFAULT_SLIDES),
    [images]
  );

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isReady, setIsReady] = useState(false);
  const [isFirstImageReady, setIsFirstImageReady] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const decodedSetRef = useRef<Set<string>>(new Set());
  const inflightRef = useRef<Record<string, Promise<void>>>({});
  const pausedUntilRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const preloadAndDecode = useCallback((url: string): Promise<void> => {
    if (decodedSetRef.current.has(url)) return Promise.resolve();
    if (url in inflightRef.current) return inflightRef.current[url];

    const promise = new Promise<void>(resolve => {
      const img = new Image();
      img.src = url;
      img.loading = 'eager';

      const finalize = () => {
        decodedSetRef.current.add(url);
        delete inflightRef.current[url];
        resolve();
      };

      if (typeof img.decode === 'function') {
        img.decode().then(finalize).catch(finalize);
      } else {
        img.onload = finalize;
        img.onerror = finalize;
      }
    });

    inflightRef.current[url] = promise;
    return promise;
  }, []);

  useEffect(() => {
    if (imageUrls.length <= 1 || !isReady) return;

    const timer = setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setIsInitialRender(false);
      setDirection('forward');
      setIndex(i => {
        const next = (i + 1) % imageUrls.length;
        void preloadAndDecode(imageUrls[next]);
        setPrevIndex(i);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [imageUrls, intervalMs, isReady, preloadAndDecode]);

  useEffect(() => {
    if (imageUrls.length <= 1) {
      setIsFirstImageReady(true);
      setIsReady(true);
      return;
    }

    let cancelled = false;

    void preloadAndDecode(imageUrls[0]).then(() => {
      if (cancelled) return;
      setIsFirstImageReady(true);
      setIsReady(true);
    });

    imageUrls.slice(1).forEach(url => {
      void preloadAndDecode(url);
    });

    return () => {
      cancelled = true;
    };
  }, [imageUrls, preloadAndDecode]);

  useEffect(() => {
    if (imageUrls.length <= 1) return;

    const next = (index + 1) % imageUrls.length;
    const afterNext = (index + 2) % imageUrls.length;
    void preloadAndDecode(imageUrls[next]);
    void preloadAndDecode(imageUrls[afterNext]);
  }, [index, imageUrls, preloadAndDecode]);

  const goTo = useCallback((dir: 'prev' | 'next') => {
    isAnimatingRef.current = true;
    pausedUntilRef.current = Date.now() + 5000;
    setIsInitialRender(false);
    if (dir === 'prev') {
      setDirection('backward');
      setIndex(i => {
        const prev = (i - 1 + imageUrls.length) % imageUrls.length;
        void preloadAndDecode(imageUrls[prev]);
        setPrevIndex(i);
        return prev;
      });
    } else {
      setDirection('forward');
      setIndex(i => {
        const next = (i + 1) % imageUrls.length;
        void preloadAndDecode(imageUrls[next]);
        setPrevIndex(i);
        return next;
      });
    }
  }, [imageUrls, preloadAndDecode]);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    goTo('prev');
  }, [goTo]);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    goTo('next');
  }, [goTo]);

  const handleAnimationComplete = useCallback(() => {
    isAnimatingRef.current = false;
  }, []);

  const slideStyle = {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    objectPosition: 'center center',
    transform: 'translateZ(0)',
    WebkitTransform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
    WebkitBackfaceVisibility: 'hidden' as const,
  };

  const showStaticFirstSlide =
    isFirstImageReady && (!isReady || (isInitialRender && index === 0));

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        transform: 'translateZ(0)',
      }}
    >
      {!isFirstImageReady && (
        <div
          className="home-slideshow__skeleton"
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
          }}
        />
      )}

      {showStaticFirstSlide && (
        <img
          key={`static-${imageUrls[0]}`}
          src={imageUrls[0]}
          alt="Berwyn Fruit Market storefront"
          width={4032}
          height={3024}
          fetchPriority="high"
          decoding="async"
          style={{
            ...slideStyle,
            zIndex: isInitialRender && index === 0 ? 2 : 1,
          }}
          draggable={false}
        />
      )}

      {isReady && prevIndex !== index && (
        <motion.img
          key={`leave-${imageUrls[prevIndex]}-${direction}`}
          src={imageUrls[prevIndex]}
          alt=""
          width={4032}
          height={3024}
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: direction === 'forward' ? '-100%' : '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ ...slideStyle, willChange: 'transform' }}
          draggable={false}
        />
      )}

      {isReady && (
        <motion.img
          key={`enter-${imageUrls[index]}-${direction}`}
          src={imageUrls[index]}
          alt="home slide"
          width={4032}
          height={3024}
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
          onAnimationComplete={handleAnimationComplete}
          style={{ ...slideStyle, willChange: 'transform' }}
          draggable={false}
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
        />
      )}

      <button
        className={`home-slideshow__control home-slideshow__control--prev${showControls ? ' home-slideshow__control--visible' : ''}`}
        onClick={handlePrev}
        aria-label="Previous slide"
        type="button"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="home-slideshow__icon">
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
        </svg>
      </button>

      <button
        className={`home-slideshow__control home-slideshow__control--next${showControls ? ' home-slideshow__control--visible' : ''}`}
        onClick={handleNext}
        aria-label="Next slide"
        type="button"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="home-slideshow__icon">
          <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

export default HomeSlideshow;
