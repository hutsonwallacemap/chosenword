'use client';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cw_theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('cw_theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('cw_theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--bg-primary)',
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="material-symbols-rounded" style={{ color: 'var(--accent-gold)', fontSize: '1.8rem' }}>menu_book</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Chosen Word</h1>
      </div>
      <button onClick={toggleTheme} style={{ color: 'var(--text-secondary)' }}>
        <span className="material-symbols-rounded" style={{ fontSize: '1.5rem' }}>
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </header>
  );
}
