import React, { useRef } from 'react';

type MagneticProps = {
  children: React.ReactNode;
  strength?: number; // how far the element leans toward the cursor, in px
  className?: string;
};

/**
 * Wraps an element so it leans toward the cursor while hovered and springs
 * back on leave. Purely transform-based, so it composites on the GPU.
 */
const Magnetic: React.FC<MagneticProps> = ({ children, strength = 14, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transition = 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = 'translate3d(0, 0, 0)';
  };

  return (
    <div
      ref={ref}
      className={`magnetic ${className ?? ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
};

export default Magnetic;
