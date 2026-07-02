import React, { useEffect, useRef, useState } from 'react';

type TypewriterProps = {
  phrases: string[];
  typeSpeed?: number;   // ms per character while typing
  deleteSpeed?: number; // ms per character while deleting
  holdTime?: number;    // ms to hold a completed phrase
};

/**
 * Cycles through phrases with a type / hold / delete loop and a blinking
 * caret. Falls back to the first phrase, static, under reduced motion.
 */
const Typewriter: React.FC<TypewriterProps> = ({
  phrases,
  typeSpeed = 55,
  deleteSpeed = 28,
  holdTime = 2200,
}) => {
  const [text, setText] = useState('');
  const [reduced, setReduced] = useState(false);
  const state = useRef({ phrase: 0, char: 0, deleting: false });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const s = state.current;
      const current = phrases[s.phrase];
      let delay = s.deleting ? deleteSpeed : typeSpeed;

      if (!s.deleting) {
        s.char++;
        if (s.char === current.length) {
          s.deleting = true;
          delay = holdTime;
        }
      } else {
        s.char--;
        if (s.char === 0) {
          s.deleting = false;
          s.phrase = (s.phrase + 1) % phrases.length;
          delay = 350;
        }
      }
      setText(current.slice(0, s.char));
      timer = setTimeout(step, delay);
    };

    timer = setTimeout(step, 400);
    return () => clearTimeout(timer);
  }, [phrases, typeSpeed, deleteSpeed, holdTime]);

  if (reduced) return <span>{phrases[0]}</span>;
  return (
    <span className="typewriter">
      {text}
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  );
};

export default Typewriter;
