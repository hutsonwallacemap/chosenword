'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Sun, Moon } from 'lucide-react';

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
    <header className="glass-panel" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          color: '#d97706', // gold
          display: 'flex'
        }}>
          <BookOpen size={32} strokeWidth={2.5} />
        </div>
        <h1 style={{ 
          fontSize: '1.6rem', 
          fontWeight: 800, 
          margin: 0,
          background: 'var(--accent-gold-grad)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Chosen Word
        </h1>
      </div>
      <button onClick={toggleTheme} style={{ 
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '10px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)',
        border: 'none',
        cursor: 'pointer'
      }}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
