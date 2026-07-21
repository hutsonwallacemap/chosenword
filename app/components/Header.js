'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Sun, Moon } from 'lucide-react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cw_theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDark(true);
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          color: 'var(--accent-gold)',
          display: 'flex',
          filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))'
        }}>
          <BookOpen size={28} strokeWidth={2.5} />
        </div>
        <h1 style={{ 
          fontSize: '1.4rem', 
          fontWeight: 800, 
          margin: 0,
          background: 'var(--accent-gold-grad)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          Chosen Word
        </h1>
      </div>
      <button onClick={toggleTheme} style={{ 
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-secondary)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      >
        {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
      </button>
    </header>
  );
}
