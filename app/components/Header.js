'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Sun, Moon, Settings } from 'lucide-react';
import { applyTheme, getCurrentTheme, THEME_EVENT } from '../lib/theme';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsDark(getCurrentTheme() === 'dark');
    const handleThemeChange = (e) => setIsDark(e.detail === 'dark');

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener(THEME_EVENT, handleThemeChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener(THEME_EVENT, handleThemeChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    applyTheme(isDark ? 'light' : 'dark');
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
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="icon-btn"
        >
          {isDark ? <Sun size={18} strokeWidth={2.5} aria-hidden="true" /> : <Moon size={18} strokeWidth={2.5} aria-hidden="true" />}
        </button>
        <Link href="/settings" aria-label="Settings" title="Settings" className="icon-btn">
          <Settings size={18} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
