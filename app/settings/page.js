'use client';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const savedTheme = localStorage.getItem('cw_theme') || 'light';
    const savedFontSize = localStorage.getItem('cw_font_size') || 'medium';
    setTheme(savedTheme);
    setFontSize(savedFontSize);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('cw_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem('cw_font_size', newSize);
    
    // Remove old font classes
    document.documentElement.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    // Add new font class
    if (newSize !== 'medium') {
      document.documentElement.classList.add(`font-${newSize}`);
    }
  };

  return (
    <div style={{ paddingBottom: '100px', animation: 'slideUp 0.4s ease-out forwards', opacity: 0 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Settings
      </h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{ color: 'var(--accent-gold)' }}>palette</span>
          Appearance
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            onClick={() => handleThemeChange('light')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${theme === 'light' ? 'var(--accent-blue)' : 'var(--border-color)'}`,
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-rounded">light_mode</span>
            <span style={{ fontWeight: 500 }}>Light</span>
          </button>
          
          <button 
            onClick={() => handleThemeChange('dark')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${theme === 'dark' ? 'var(--accent-blue)' : 'var(--border-color)'}`,
              backgroundColor: '#1f2937',
              color: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span className="material-symbols-rounded">dark_mode</span>
            <span style={{ fontWeight: 500 }}>Dark</span>
          </button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{ color: 'var(--accent-blue)' }}>format_size</span>
          Text Size
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 'small', label: 'Small', size: '14px' },
            { id: 'medium', label: 'Medium (Default)', size: '16px' },
            { id: 'large', label: 'Large', size: '18px' },
            { id: 'xlarge', label: 'Extra Large', size: '20px' }
          ].map((sizeOpt) => (
            <button
              key={sizeOpt.id}
              onClick={() => handleFontSizeChange(sizeOpt.id)}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${fontSize === sizeOpt.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                backgroundColor: fontSize === sizeOpt.id ? 'var(--accent-blue-light)' : 'var(--bg-primary)',
                color: 'var(--text-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: sizeOpt.size }}>{sizeOpt.label}</span>
              {fontSize === sizeOpt.id && (
                <span className="material-symbols-rounded" style={{ color: 'var(--accent-blue)' }}>check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
