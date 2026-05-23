import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_SLIDES = Array.from({ length: 11 }, (_, i) => {
  const n = i + 1;
  return `/home-slide-${n}.webp`;
});

interface HomeSlideshowProps {
  images?: string[];
  intervalMs?: number;
  className?: string;
}

export const HomeSlideshow: React.FC<HomeSlideshowProps> = ({
  images,
  intervalMs = 3500,
  className,
}) => {
  const imageUrls = useMemo(
    () => (images && images.length > 0 ? images : DEFAULT_SLIDES),
    [images]
  );

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState<number>(0);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isReady, setIsReady] = useState(imageUrls.length <= 1);
  const [isFirstImageReady, setIsFirstImageReady] = useState(
    imageUrls.length <= 1
  );
  const [isInitialRender, setIsInitialRender] = useState(true);
  const decodedSetRef = useRef<Set<string>>(new Set());
  const inflightRef = useRef<Record<string, Promise<void>>>({});

  const preloadAndDecode = React.useCallback((url: string): Promise<void> => {
    if (decodedSetRef.current.has(url)) return Promise.resolve();
    if (url in inflightRef.current) return inflightRef.current[url];
    const promise = new Promise<void>(resolve => {
      const img = new Image();
      img.src = url;
      img.loading = 'eager';

      const decodePromise: Promise<void> | undefined =
        typeof img.decode === 'function' ? img.decode() : undefined;
      const finalize = () => {
        decodedSetRef.current.add(url);
        delete inflightRef.current[url];
        resolve();
      };
      if (decodePromise) {
        decodePromise.then(finalize).catch(finalize);
      } else {
        img.onload = finalize;
        img.onerror = finalize;
      }
    });
    inflightRef.current[url] = promise;
    return promise;
  }, []);

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const timer = setInterval(() => {
      if (!isSliding && isReady && Date.now() >= pausedUntil) {
        setIsInitialRender(false);
        setDirection('forward');
        setIndex(i => {
          setPrevIndex(i);
          return (i + 1) % imageUrls.length;
        });
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [imageUrls.length, intervalMs, pausedUntil, isSliding, isReady]);

  // Show first slide ASAP; decode remaining slides in the background
  useEffect(() => {
    if (imageUrls.length <= 1) {
      setIsReady(true);
      setIsFirstImageReady(true);
      return;
    }

    let cancelled = false;
    const firstUrl = imageUrls[0];

    void preloadAndDecode(firstUrl).then(() => {
      if (cancelled) return;
      setIsFirstImageReady(true);
      setIsReady(true);
      setTimeout(() => setIsInitialRender(false), 100);
    });

    void Promise.all(
      imageUrls.slice(1).map(url => preloadAndDecode(url))
    ).catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [imageUrls, preloadAndDecode]);

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const preloadTargets = [
      (index + 1) % imageUrls.length,
      (index + 2) % imageUrls.length,
    ];
    preloadTargets.forEach(t => {
      void preloadAndDecode(imageUrls[t]);
    });
  }, [index, imageUrls, preloadAndDecode]);

  const pauseAuto = () => setPausedUntil(Date.now() + 3000);

  const slideToIndex = async (target: number) => {
    if (isSliding) return;
    setIsInitialRender(false);
    const normalizedTarget =
      ((target % imageUrls.length) + imageUrls.length) % imageUrls.length;
    const targetUrl = imageUrls[normalizedTarget];
    await preloadAndDecode(targetUrl);
    setIsSliding(true);
    pauseAuto();
    setIndex(i => {
      setPrevIndex(i);
      return normalizedTarget;
    });
    setTimeout(() => setIsSliding(false), 820);
  };

  const goPrev = () => {
    if (isSliding) return;
    setDirection('backward');
    void slideToIndex(index - 1);
  };
  const goNext = () => {
    if (isSliding) return;
    setDirection('forward');
    void slideToIndex(index + 1);
  };

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

      {isFirstImageReady && (
        <img
          key={`static-${imageUrls[0]}`}
          src={imageUrls[0]}
          alt="Berwyn Fruit Market storefront"
          width={4032}
          height={3024}
          fetchPriority="high"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
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
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            willChange: 'transform',
          }}
          draggable={false}
        />
      )}

      {isReady && !(isInitialRender && index === 0) && (
        <motion.img
          key={`enter-${imageUrls[index]}-${direction}`}
          src={imageUrls[index]}
          alt="home slide"
          width={4032}
          height={3024}
          initial={{
            x: direction === 'forward' ? '100%' : '-100%',
            opacity: 1,
          }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            willChange: 'transform',
          }}
          draggable={false}
        />
      )}

      {isReady && imageUrls.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className="home-slide__control home-slide__control--prev"
            disabled={isSliding}
          >
            <svg className="home-slide__icon" viewBox="0 0 24 24" aria-hidden>
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
            <svg className="home-slide__icon" viewBox="0 0 24 24" aria-hidden>
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default HomeSlideshow;
