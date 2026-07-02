import React, { useEffect } from 'react';

import './styling/Welcome.css';
const myPic = require('../MyPic.png');

type WelcomeProps = {
  onContinue: () => void;
};

const Welcome: React.FC<WelcomeProps> = ({ onContinue }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        onContinue();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onContinue]);

  return (
    <div className="welcome-root" role="dialog" aria-modal="true" aria-label="Welcome" onClick={onContinue}>
      <div className="welcome-glow" aria-hidden="true" />
      <div className="welcome-inner">
        <span className="welcome-mark"><img src={myPic} alt="Jack Kurtz" /></span>
        <h1 className="welcome-title" aria-label="Jack Kurtz">
          {'Jack Kurtz'.split('').map((ch, i) => (
            <span
              key={i}
              className="welcome-letter"
              aria-hidden="true"
              style={{ animationDelay: `${0.12 + i * 0.05}s` }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h1>
        <p className="welcome-sub">AI Engineer</p>
        <div className="welcome-progress" aria-hidden="true">
          <span className="welcome-progress-bar" />
        </div>
        <div className="welcome-hint">Click anywhere to enter</div>
      </div>
    </div>
  );
};

export default Welcome;
