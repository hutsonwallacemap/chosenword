'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Sun, 
  Moon, 
  Type, 
  CheckCircle2, 
  Database, 
  Download, 
  Upload, 
  Check, 
  Trash2, 
  HardDrive, 
  ShieldCheck, 
  RefreshCw,
  Bell,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [storageStats, setStorageStats] = useState({
    versesCount: 0,
    bookmarksCount: 0,
    notesCount: 0,
    bytesUsed: 0,
    kbUsed: '0'
  });
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [reminderResetMsg, setReminderResetMsg] = useState(false);

  const fileInputRef = useRef(null);

  const calculateStorage = () => {
    try {
      const savedVerses = JSON.parse(localStorage.getItem('cw_saved_verses') || '[]');
      const bookmarks = JSON.parse(localStorage.getItem('cw_bookmarks') || '[]');
      const verseNotes = JSON.parse(localStorage.getItem('cw_notes') || '{}');
      const chNotes = JSON.parse(localStorage.getItem('cw_chapter_notes') || '{}');
      const bNotes = JSON.parse(localStorage.getItem('cw_book_notes') || '{}');

      const totalNotes = Object.keys(verseNotes).length + Object.keys(chNotes).length + Object.keys(bNotes).length;

      // Approximate localStorage bytes used by this origin
      let totalBytes = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalBytes += (localStorage[key].length + key.length) * 2;
        }
      }

      setStorageStats({
        versesCount: savedVerses.length,
        bookmarksCount: bookmarks.length,
        notesCount: totalNotes,
        bytesUsed: totalBytes,
        kbUsed: (totalBytes / 1024).toFixed(1)
      });
    } catch (e) {
      console.error('Storage calculation failed', e);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('cw_theme') || 'light';
    const savedFontSize = localStorage.getItem('cw_font_size') || 'medium';
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    calculateStorage();
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('cw_theme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
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

  // Export JSON Backup
  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.0',
        app: 'Chosen Word Bible App',
        exportedAt: new Date().toISOString(),
        data: {
          savedVerses: JSON.parse(localStorage.getItem('cw_saved_verses') || '[]'),
          bookmarks: JSON.parse(localStorage.getItem('cw_bookmarks') || '[]'),
          notes: JSON.parse(localStorage.getItem('cw_notes') || '{}'),
          chapterNotes: JSON.parse(localStorage.getItem('cw_chapter_notes') || '{}'),
          bookNotes: JSON.parse(localStorage.getItem('cw_book_notes') || '{}'),
          readingPlans: JSON.parse(localStorage.getItem('cw_reading_plans') || '{}'),
          settings: {
            theme: localStorage.getItem('cw_theme') || 'light',
            fontSize: localStorage.getItem('cw_font_size') || 'medium'
          }
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `chosen_word_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  // Import JSON Backup
  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const data = json.data || json;

        if (data.savedVerses) {
          const existing = JSON.parse(localStorage.getItem('cw_saved_verses') || '[]');
          const map = new Map();
          existing.forEach(v => map.set(`${v.ref}::${v.text}`, v));
          data.savedVerses.forEach(v => map.set(`${v.ref}::${v.text}`, v));
          localStorage.setItem('cw_saved_verses', JSON.stringify(Array.from(map.values())));
        }

        if (data.bookmarks) {
          const existing = JSON.parse(localStorage.getItem('cw_bookmarks') || '[]');
          const map = new Map();
          existing.forEach(b => map.set(b.ref, b));
          data.bookmarks.forEach(b => map.set(b.ref, b));
          localStorage.setItem('cw_bookmarks', JSON.stringify(Array.from(map.values())));
        }

        if (data.notes) {
          const existing = JSON.parse(localStorage.getItem('cw_notes') || '{}');
          localStorage.setItem('cw_notes', JSON.stringify({ ...existing, ...data.notes }));
        }

        if (data.chapterNotes) {
          const existing = JSON.parse(localStorage.getItem('cw_chapter_notes') || '{}');
          localStorage.setItem('cw_chapter_notes', JSON.stringify({ ...existing, ...data.chapterNotes }));
        }

        if (data.bookNotes) {
          const existing = JSON.parse(localStorage.getItem('cw_book_notes') || '{}');
          localStorage.setItem('cw_book_notes', JSON.stringify({ ...existing, ...data.bookNotes }));
        }

        calculateStorage();
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(''), 4000);
      } catch (err) {
        alert(`Invalid JSON backup file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleResetReminder = () => {
    localStorage.removeItem('cw_backup_reminder_dismissed');
    setReminderResetMsg(true);
    setTimeout(() => setReminderResetMsg(false), 3000);
  };

  const handleClearAllData = () => {
    const confirm = window.confirm(
      'Are you sure you want to clear your saved verses, notes, and bookmarks? This cannot be undone unless you have a JSON backup.'
    );
    if (confirm) {
      localStorage.removeItem('cw_saved_verses');
      localStorage.removeItem('cw_bookmarks');
      localStorage.removeItem('cw_notes');
      localStorage.removeItem('cw_chapter_notes');
      localStorage.removeItem('cw_book_notes');
      calculateStorage();
      alert('All personal data has been cleared.');
    }
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

      {/* Data & Multi-Device Backup Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} style={{ color: 'var(--accent-gold)' }} />
            Data & Multi-Device Backup
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {storageStats.kbUsed} KB used
          </span>
        </div>

        <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Chosen Word stores your data completely offline in your browser. Use the JSON backup to transfer your highlights and notes across phones, tablets, or computers with zero cloud account required.
        </p>

        {/* Item Count Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '18px' }}>
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Verses</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{storageStats.versesCount}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Notes</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-purple, #8b5cf6)' }}>{storageStats.notesCount}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Bookmarks</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{storageStats.bookmarksCount}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportFile} 
            accept=".json,application/json" 
            style={{ display: 'none' }} 
          />

          <button
            onClick={handleExportBackup}
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
            <span>{exportSuccess ? 'Backup Downloaded!' : 'Export JSON Backup'}</span>
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
            <span>Restore JSON Backup</span>
          </button>
        </div>

        {importStatus && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#15803d', fontWeight: 600, fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Secondary controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={handleResetReminder}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <Bell size={14} />
            <span>{reminderResetMsg ? 'Reminder enabled in Collection!' : 'Reset Backup Reminder'}</span>
          </button>

          <button
            onClick={handleClearAllData}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <Trash2 size={14} />
            <span>Clear Stored Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
