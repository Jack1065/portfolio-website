import React, { useRef } from 'react';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees
};

/**
 * 3D perspective tilt that follows the cursor, with a moving specular glare.
 * Writes CSS custom properties consumed by the stylesheet, so the visual
 * treatment stays in CSS and this component stays generic.
 */
const TiltCard: React.FC<TiltCardProps> = ({ children, className, maxTilt = 7 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(py - 0.5) * -2 * maxTilt}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * 2 * maxTilt}deg`);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
      el.classList.add('is-tilting');
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('is-tilting');
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className ?? ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  );
};

export default TiltCard;
