'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Sun, 
  Moon, 
  Type, 
  CheckCircle2,
  Download,
  Upload,
  Check,
  Trash2,
  ShieldCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { applyTheme, getCurrentTheme, THEME_EVENT } from '../lib/theme';
import { getDataSummary, downloadBackup, restoreBackup, eraseAllUserData, describeRestore } from '../lib/backup';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [summary, setSummary] = useState({ highlights: 0, notes: 0, bookmarks: 0, lastBackup: null });
  const [exportSuccess, setExportSuccess] = useState(false);
  // { type: 'success' | 'error', text }
  const [backupMessage, setBackupMessage] = useState(null);

  const fileInputRef = useRef(null);

  const refreshSummary = () => {
    try {
      setSummary(getDataSummary());
    } catch (e) {
      console.error('Could not read saved data', e);
    }
  };

  const showBackupMessage = (type, text) => {
    setBackupMessage({ type, text });
    setTimeout(() => setBackupMessage(null), 5000);
  };

  useEffect(() => {
    const savedFontSize = localStorage.getItem('cw_font_size') || 'medium';
    setTheme(getCurrentTheme());
    setFontSize(savedFontSize);
    refreshSummary();

    // Stay in sync when the Header toggle changes the theme
    const handleExternalThemeChange = (e) => setTheme(e.detail);
    window.addEventListener(THEME_EVENT, handleExternalThemeChange);
    return () => window.removeEventListener(THEME_EVENT, handleExternalThemeChange);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
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

  const handleBackup = () => {
    try {
      downloadBackup();
      refreshSummary();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      showBackupMessage('error', 'The backup could not be created. Please try again.');
    }
  };

  const handleRestoreFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const counts = restoreBackup(e.target.result);
        refreshSummary();
        showBackupMessage('success', describeRestore(counts));
      } catch (err) {
        showBackupMessage('error', err.message);
      }
    };
    reader.onerror = () => showBackupMessage('error', 'The file could not be opened.');
    reader.readAsText(file);
  };

  const handleEraseAll = () => {
    const confirmed = window.confirm(
      'Erase all your highlights, notes, bookmarks, reading-plan progress, streaks and quiz answers from this device?\n\nThis cannot be undone. Back up first if you might want them later.'
    );
    if (!confirmed) return;
    eraseAllUserData();
    refreshSummary();
    showBackupMessage('success', 'All your data has been erased from this device.');
  };

  const formatLastBackup = (timestamp) => {
    if (!timestamp) return 'Never backed up';
    const date = new Date(timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    return `Last backup: ${date}`;
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '100px', animation: 'pageFadeIn 0.3s ease-out forwards' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)' }}>
        Settings
      </h1>

      {/* Appearance Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={20} style={{ color: 'var(--accent-gold)' }} />
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
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Sun size={24} />
            <span style={{ fontWeight: 600 }}>Light</span>
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
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Moon size={24} />
            <span style={{ fontWeight: 600 }}>Dark</span>
          </button>
        </div>
      </div>

      {/* Text Size Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Type size={20} style={{ color: 'var(--accent-blue)' }} />
          Reading Font Size
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${fontSize === sizeOpt.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                backgroundColor: fontSize === sizeOpt.id ? 'var(--accent-blue-light)' : 'var(--bg-primary)',
                color: 'var(--text-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: sizeOpt.size, fontWeight: 500 }}>{sizeOpt.label}</span>
              {fontSize === sizeOpt.id && (
                <CheckCircle2 size={18} style={{ color: 'var(--accent-blue)' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Backup & Restore Section */}
      <div id="backup" className="card" style={{ marginBottom: '20px', scrollMarginTop: '96px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--accent-gold)' }} />
          Backup & Restore
        </h2>

        <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Your highlights, notes and bookmarks are saved only on this device. Back them up to a file to keep them safe, or to move them to another phone or computer.
        </p>

        {/* What will be backed up */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
          {[
            { label: 'Highlights', value: summary.highlights, color: 'var(--accent-gold)' },
            { label: 'Notes', value: summary.notes, color: 'var(--accent-purple)' },
            { label: 'Bookmarks', value: summary.bookmarks, color: 'var(--accent-blue)' },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} />
          {formatLastBackup(summary.lastBackup)}
        </p>

        {/* Main actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleRestoreFile}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />

          <button
            onClick={handleBackup}
            style={{
              flex: 1,
              minWidth: '160px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gold-grad)',
              color: '#1e293b',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
            }}
          >
            {exportSuccess ? <Check size={18} /> : <Download size={18} />}
            <span>{exportSuccess ? 'Backup saved' : 'Back up to file'}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              flex: 1,
              minWidth: '160px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Upload size={18} style={{ color: 'var(--accent-blue)' }} />
            <span>Restore from file</span>
          </button>
        </div>

        {backupMessage && (
          <div role="status" style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: backupMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            color: backupMessage.type === 'error' ? '#dc2626' : '#15803d',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {backupMessage.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            <span>{backupMessage.text}</span>
          </div>
        )}

        <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
          Restoring adds the backup to what's already here. Nothing on this device is deleted.
        </p>

        {/* Danger zone */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Erase all my data</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Removes highlights, notes, bookmarks, plan progress and streaks. Theme and text size are kept.</div>
          </div>
          <button
            onClick={handleEraseAll}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={15} />
            <span>Erase</span>
          </button>
        </div>
      </div>
    </div>
  );
}
