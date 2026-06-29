import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './Components/Dashboard.tsx';
import Welcome from './Components/Welcome.tsx';

function App() {
  // default to true so the welcome shows on initial render
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    try {
      // support manual override via query param if needed
      const params = new URLSearchParams(window.location.search);
      const force = params.get('welcome') === '1';
      if (force) setShowWelcome(true);
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const handler = () => setShowWelcome(true);
    // plain JS event listener; other modules can dispatch `new Event('show-welcome')`
    window.addEventListener('show-welcome', handler);
    return () => window.removeEventListener('show-welcome', handler);
  }, []);

  // Auto-dismiss the intro after the entrance animation so it isn't a hard gate.
  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => setShowWelcome(false), 2600);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  const handleContinue = () => {
    try { localStorage.setItem('dashboard.welcome.seen', '1'); } catch (e) {}
    setShowWelcome(false);
  };

  return (
    <div className="App">
      {showWelcome && <Welcome onContinue={handleContinue} />}
      <Dashboard />
    </div>
  );
}

export default App;
