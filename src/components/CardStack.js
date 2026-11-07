import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiCode } from 'react-icons/fi';
import './CardStack.css';

// Helper to wrap index around array length
function wrapIndex(n, len) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

// Signed offset from active index with wrapping
function signedOffset(i, active, len, loop) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

const DRAG_CONSTRAINTS = { left: 0, right: 0 };

export function CardStack({
  items,
  initialIndex = 0,
  maxVisible = 5,
  overlap = 0.42,
  spreadDeg = 36,
  perspectivePx = 1100,
  depthPx = 110,
  tiltXDeg = 8,
  activeLiftPx = 20,
  activeScale = 1.03,
  inactiveScale = 0.92,
  springStiffness = 300,
  springDamping = 30,
  loop = true,
  autoAdvance = true,
  intervalMs = 4500,
  pauseOnHover = true,
  showDots = true,
  className = '',
  onChangeIndex,
  t = {},
}) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute responsive card dimensions
  const { cardWidth, cardHeight } = useMemo(() => {
    if (windowWidth < 480) {
      return { cardWidth: Math.min(windowWidth - 36, 340), cardHeight: 380 };
    }
    if (windowWidth < 768) {
      return { cardWidth: Math.min(windowWidth - 48, 440), cardHeight: 400 };
    }
    if (windowWidth < 1024) {
      return { cardWidth: 500, cardHeight: 420 };
    }
    return { cardWidth: 540, cardHeight: 440 };
  }, [windowWidth]);

  // Keep active in bounds
  useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]);
  }, [active, len, items, onChangeIndex]);

  const { maxOffset, cardSpacing, stepDeg } = useMemo(() => {
    const half = Math.floor(maxVisible / 2);
    return {
      maxOffset: Math.max(0, half),
      cardSpacing: Math.max(10, Math.round(cardWidth * (1 - overlap))),
      stepDeg: half > 0 ? spreadDeg / half : 0,
    };
  }, [maxVisible, cardWidth, overlap, spreadDeg]);

  const springTransition = useMemo(
    () => ({
      type: 'spring',
      stiffness: springStiffness,
      damping: springDamping,
    }),
    [springStiffness, springDamping]
  );

  const prev = useCallback(() => {
    if (!len) return;
    setActive((a) => (loop || a > 0 ? wrapIndex(a - 1, len) : a));
  }, [loop, len]);

  const next = useCallback(() => {
    if (!len) return;
    setActive((a) => (loop || a < len - 1 ? wrapIndex(a + 1, len) : a));
  }, [loop, len]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    },
    [prev, next]
  );

  const handleDragEnd = useCallback(
    (_e, info) => {
      if (reduceMotion) return;
      const travel = info.offset.x;
      const v = info.velocity.x;
      const threshold = Math.min(130, cardWidth * 0.2);

      if (travel > threshold || v > 500) prev();
      else if (travel < -threshold || v < -500) next();
    },
    [reduceMotion, cardWidth, prev, next]
  );

  // Autoplay
  useEffect(() => {
    if (!autoAdvance || reduceMotion || !len || (pauseOnHover && hovering)) return;

    const timer = setInterval(() => {
      setActive((a) => (loop || a < len - 1 ? wrapIndex(a + 1, len) : a));
    }, Math.max(1500, intervalMs));

    return () => clearInterval(timer);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const publicUrl = process.env.PUBLIC_URL || '';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return publicUrl ? `${publicUrl}/${cleanPath}` : `/${cleanPath}`;
  };

  const getDisplayDomain = (link) => {
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch {
      return 'project.demo';
    }
  };

  if (!len) return null;

  return (
    <div
      className={`cardstack-container ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-label="3D Projects Carousel"
    >
      {/* 3D Stage */}
      <div
        className="cardstack-stage"
        style={{ height: Math.max(420, cardHeight + 80) }}
      >
        {/* Background glow ambiance */}
        <div className="cardstack-glow-top" aria-hidden="true" />
        <div className="cardstack-glow-bottom" aria-hidden="true" />

        <div
          className="cardstack-viewport"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              if (!visible) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 12; // subtle arc-down
              const z = -abs * depthPx;
              const isActive = off === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;
              const domain = getDisplayDomain(item.link);
              const imageUrl = getImageUrl(item.image);

              return (
                <motion.div
                  key={item.id || item.title}
                  className={`cardstack-card ${isActive ? 'is-active' : 'is-inactive'}`}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 50,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={springTransition}
                  onClick={() => {
                    if (!isActive) setActive(i);
                  }}
                  drag={isActive ? 'x' : false}
                  dragConstraints={isActive ? DRAG_CONSTRAINTS : undefined}
                  dragElastic={isActive ? 0.2 : undefined}
                  onDragEnd={isActive ? handleDragEnd : undefined}
                >
                  <div
                    className="cardstack-card-inner"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Browser Mockup Header */}
                    <div className="cardstack-browser-header">
                      <div className="cardstack-dots">
                        <span className="dot red" />
                        <span className="dot yellow" />
                        <span className="dot green" />
                      </div>
                      <div className="cardstack-address-bar">
                        https://{domain}
                      </div>
                    </div>

                    {/* Image Area */}
                    <div className="cardstack-img-wrap">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${item.title} Preview`}
                          className="cardstack-img"
                          draggable={false}
                          loading="eager"
                        />
                      ) : (
                        <div className="cardstack-img-fallback">
                          <FiCode size={38} />
                          <span>{item.title}</span>
                        </div>
                      )}
                      <div className="cardstack-scrim" />
                    </div>

                    {/* Card Content Overlay */}
                    <div className="cardstack-card-body">
                      <div className="cardstack-title-row">
                        <h3 className="cardstack-title">{item.title}</h3>
                        <span className="cardstack-badge">
                          {t.Featured || 'Featured'}
                        </span>
                      </div>

                      <p className="cardstack-desc">{item.description}</p>

                      <div className="cardstack-footer">
                        <div className="cardstack-stack">
                          {item.techStack &&
                            item.techStack.map((tech, idx) => (
                              <span key={idx} className="cardstack-pill">
                                {tech}
                              </span>
                            ))}
                        </div>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cardstack-btn-cta"
                            title={`Open ${item.title}`}
                            onPointerDownCapture={(e) => e.stopPropagation()}
                          >
                            <span>{t.LiveDemo || 'Live Demo'}</span>
                            <FiExternalLink />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel Controls & Dots */}
      <div className="cardstack-controls">
        <button
          className="cardstack-nav-btn prev-btn"
          onClick={prev}
          aria-label="Previous project"
          title="Previous"
        >
          <FiChevronLeft size={20} />
        </button>

        {showDots && (
          <div className="cardstack-dots-bar">
            {items.map((it, idx) => {
              const isOn = idx === active;
              return (
                <button
                  key={it.id || idx}
                  onClick={() => setActive(idx)}
                  className={`cardstack-dot ${isOn ? 'active' : ''}`}
                  aria-label={`Go to ${it.title}`}
                  title={it.title}
                >
                  <span className="dot-inner" />
                </button>
              );
            })}
          </div>
        )}

        <button
          className="cardstack-nav-btn next-btn"
          onClick={next}
          aria-label="Next project"
          title="Next"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Swipe / Interaction Hint */}
      <div className="cardstack-hint">
        <span>{t.CardStackHint || '✦ Trascina la scheda o usa le frecce per sfogliare i progetti'}</span>
      </div>
    </div>
  );
}

export default CardStack;
