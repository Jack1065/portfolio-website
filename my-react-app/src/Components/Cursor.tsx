import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a small dot that tracks the pointer 1:1 and a ring that
 * follows on a spring. The ring expands over links/buttons. Renders nothing
 * on touch devices or when the user prefers reduced motion.
 */
const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100;      // pointer
    let rx = -100, ry = -100;      // spring ring
    let vx = 0, vy = 0;
    let visible = false;
    let raf = 0;

    const STIFFNESS = 0.16;
    const DAMPING = 0.72;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        rx = mx; ry = my;
        document.body.classList.add('has-cursor');
      }
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest('a, button, [role="button"], .magnetic');
      ring.classList.toggle('is-hover', interactive);
    };

    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => {
      visible = false;
      document.body.classList.remove('has-cursor');
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      // Critically-damped-ish spring for the ring.
      vx = (vx + (mx - rx) * STIFFNESS) * DAMPING;
      vy = (vy + (my - ry) * STIFFNESS) * DAMPING;
      rx += vx;
      ry += vy;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    };
    tick();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.body.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default Cursor;
