'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Share2, 
  Trash2, 
  Bookmark, 
  Download, 
  Upload, 
  ShieldCheck, 
  X, 
  Check, 
  FileText, 
  BookOpen, 
  Sparkles, 
  Search, 
  Filter,
  Edit3,
  ExternalLink,
  HardDriveDownload,
  AlertCircle
} from 'lucide-react';

// Helper to parse verse reference like "John 3:16" or "1 John 2:1" into book & chapter
const parseRef = (ref) => {
  if (!ref) return { book: 'Genesis', chapter: 1 };
  const lastSpace = ref.lastIndexOf(' ');
  if (lastSpace === -1) return { book: ref, chapter: 1 };
  const book = ref.substring(0, lastSpace);
  const rest = ref.substring(lastSpace + 1);
  const chapter = parseInt(rest.split(':')[0]) || 1;
  return { book, chapter };
};

export default function SavedItems() {
  const [activeTab, setActiveTab] = useState('verses'); // 'verses', 'notes', 'chapters'
  const [savedVerses, setSavedVerses] = useState([]);
  const [bookmarkedChapters, setBookmarkedChapters] = useState([]);
  const [verseNotes, setVerseNotes] = useState({});
  const [chapterNotes, setChapterNotes] = useState({});
  const [bookNotes, setBookNotes] = useState({});
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState('all'); // 'all', 'gold', 'emerald', 'sky', 'rose'
  const [noteTypeFilter, setNoteTypeFilter] = useState('all'); // 'all', 'verse', 'chapter', 'book'

  // Backup reminder & feedback
  const [showReminder, setShowReminder] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importFeedback, setImportFeedback] = useState('');
  
  // Note editing state
  const [editingNoteKey, setEditingNoteKey] = useState(null);
  const [editingNoteType, setEditingNoteType] = useState('verse'); // 'verse', 'chapter', 'book'
  const [editingNoteText, setEditingNoteText] = useState('');

  const fileInputRef = useRef(null);

  // Load all user collections from localStorage
  const loadLocalData = () => {
    try {
      setSavedVerses(JSON.parse(localStorage.getItem('cw_saved_verses')) || []);
      setBookmarkedChapters(JSON.parse(localStorage.getItem('cw_bookmarks')) || []);
      setVerseNotes(JSON.parse(localStorage.getItem('cw_notes')) || {});
      setChapterNotes(JSON.parse(localStorage.getItem('cw_chapter_notes')) || {});
      setBookNotes(JSON.parse(localStorage.getItem('cw_book_notes')) || {});
    } catch (e) {
      console.error('Failed to load storage data', e);
    }
  };

  useEffect(() => {
    loadLocalData();

    // Check backup reminder dismiss status
    const dismissedTime = localStorage.getItem('cw_backup_reminder_dismissed');
    const now = Date.now();
    const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;
    if (!dismissedTime || now - parseInt(dismissedTime) > FOURTEEN_DAYS) {
      setShowReminder(true);
    }
  }, []);

  const totalNotesCount = 
    Object.keys(verseNotes).length + 
    Object.keys(chapterNotes).length + 
    Object.keys(bookNotes).length;

  const totalItemsCount = savedVerses.length + bookmarkedChapters.length + totalNotesCount;

  // Handle dismiss reminder
  const dismissReminder = () => {
    setShowReminder(false);
    localStorage.setItem('cw_backup_reminder_dismissed', Date.now().toString());
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
      setTimeout(() => setExportSuccess(false), 3500);
      dismissReminder();
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

        let vCount = 0;
        let bCount = 0;
        let nCount = 0;

        if (data.savedVerses && Array.isArray(data.savedVerses)) {
          const existing = JSON.parse(localStorage.getItem('cw_saved_verses') || '[]');
          const map = new Map();
          existing.forEach(v => map.set(`${v.ref}::${v.text}`, v));
          data.savedVerses.forEach(v => map.set(`${v.ref}::${v.text}`, v));
          const merged = Array.from(map.values());
          localStorage.setItem('cw_saved_verses', JSON.stringify(merged));
          setSavedVerses(merged);
          vCount = data.savedVerses.length;
        }

        if (data.bookmarks && Array.isArray(data.bookmarks)) {
          const existing = JSON.parse(localStorage.getItem('cw_bookmarks') || '[]');
          const map = new Map();
          existing.forEach(b => map.set(b.ref, b));
          data.bookmarks.forEach(b => map.set(b.ref, b));
          const merged = Array.from(map.values());
          localStorage.setItem('cw_bookmarks', JSON.stringify(merged));
          setBookmarkedChapters(merged);
          bCount = data.bookmarks.length;
        }

        if (data.notes && typeof data.notes === 'object') {
          const existing = JSON.parse(localStorage.getItem('cw_notes') || '{}');
          const merged = { ...existing, ...data.notes };
          localStorage.setItem('cw_notes', JSON.stringify(merged));
          setVerseNotes(merged);
          nCount += Object.keys(data.notes).length;
        }

        if (data.chapterNotes && typeof data.chapterNotes === 'object') {
          const existing = JSON.parse(localStorage.getItem('cw_chapter_notes') || '{}');
          const merged = { ...existing, ...data.chapterNotes };
          localStorage.setItem('cw_chapter_notes', JSON.stringify(merged));
          setChapterNotes(merged);
          nCount += Object.keys(data.chapterNotes).length;
        }

        if (data.bookNotes && typeof data.bookNotes === 'object') {
          const existing = JSON.parse(localStorage.getItem('cw_book_notes') || '{}');
          const merged = { ...existing, ...data.bookNotes };
          localStorage.setItem('cw_book_notes', JSON.stringify(merged));
          setBookNotes(merged);
          nCount += Object.keys(data.bookNotes).length;
        }

        if (data.readingPlans && typeof data.readingPlans === 'object') {
          const existing = JSON.parse(localStorage.getItem('cw_reading_plans') || '{}');
          const merged = { ...existing, ...data.readingPlans };
          localStorage.setItem('cw_reading_plans', JSON.stringify(merged));
        }

        setImportFeedback(`Restored ${vCount} verses, ${bCount} bookmarks, and ${nCount} notes!`);
        setTimeout(() => setImportFeedback(''), 5000);
      } catch (err) {
        alert(`Invalid backup JSON file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Item deletion handlers
  const removeVerse = (ref, text) => {
    const newSaved = savedVerses.filter(v => !(v.ref === ref && v.text === text));
    setSavedVerses(newSaved);
    localStorage.setItem('cw_saved_verses', JSON.stringify(newSaved));
  };

  const removeBookmark = (ref) => {
    const newBookmarks = bookmarkedChapters.filter(b => b.ref !== ref);
    setBookmarkedChapters(newBookmarks);
    localStorage.setItem('cw_bookmarks', JSON.stringify(newBookmarks));
  };

  const deleteNote = (type, key) => {
    if (type === 'verse') {
      const updated = { ...verseNotes };
      delete updated[key];
      setVerseNotes(updated);
      localStorage.setItem('cw_notes', JSON.stringify(updated));
    } else if (type === 'chapter') {
      const updated = { ...chapterNotes };
      delete updated[key];
      setChapterNotes(updated);
      localStorage.setItem('cw_chapter_notes', JSON.stringify(updated));
    } else if (type === 'book') {
      const updated = { ...bookNotes };
      delete updated[key];
      setBookNotes(updated);
      localStorage.setItem('cw_book_notes', JSON.stringify(updated));
    }
  };

  const saveEditedNote = () => {
    if (!editingNoteKey) return;
    const text = editingNoteText.trim();
    if (editingNoteType === 'verse') {
      const updated = { ...verseNotes };
      if (text) updated[editingNoteKey] = text;
      else delete updated[editingNoteKey];
      setVerseNotes(updated);
      localStorage.setItem('cw_notes', JSON.stringify(updated));
    } else if (editingNoteType === 'chapter') {
      const updated = { ...chapterNotes };
      if (text) updated[editingNoteKey] = text;
      else delete updated[editingNoteKey];
      setChapterNotes(updated);
      localStorage.setItem('cw_chapter_notes', JSON.stringify(updated));
    } else if (editingNoteType === 'book') {
      const updated = { ...bookNotes };
      if (text) updated[editingNoteKey] = text;
      else delete updated[editingNoteKey];
      setBookNotes(updated);
      localStorage.setItem('cw_book_notes', JSON.stringify(updated));
    }
    setEditingNoteKey(null);
  };

  // Share Verse
  const shareVerse = (verse) => {
    const text = `"${verse.text}" - ${verse.ref} (${(verse.lang || 'kjv').toUpperCase()}) | via Chosen Word`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Share Verse',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert(`Copied verse to clipboard:\n\n${text}`);
    }
  };

  // Filtered Verses
  const filteredVerses = useMemo(() => {
    return savedVerses.filter(v => {
      const color = v.color || 'gold';
      if (colorFilter !== 'all' && color !== colorFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (v.ref || '').toLowerCase().includes(q) || (v.text || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [savedVerses, colorFilter, searchQuery]);

  // Combined and filtered notes list
  const combinedNotes = useMemo(() => {
    const list = [];
    Object.entries(verseNotes).forEach(([ref, text]) => {
      list.push({ type: 'verse', key: ref, ref, text, label: 'Verse Note' });
    });
    Object.entries(chapterNotes).forEach(([ref, text]) => {
      list.push({ type: 'chapter', key: ref, ref, text, label: 'Chapter Note' });
    });
    Object.entries(bookNotes).forEach(([ref, text]) => {
      list.push({ type: 'book', key: ref, ref, text, label: 'Book Note' });
    });

    return list.filter(item => {
      if (noteTypeFilter !== 'all' && item.type !== noteTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.ref.toLowerCase().includes(q) || item.text.toLowerCase().includes(q);
      }
      return true;
    });
  }, [verseNotes, chapterNotes, bookNotes, noteTypeFilter, searchQuery]);

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Top Header & Backup Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', background: 'var(--accent-gold-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your Collection
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {savedVerses.length} saved verses &bull; {totalNotesCount} notes &bull; {bookmarkedChapters.length} bookmarks
          </p>
        </div>

        {/* Export / Import Toolbar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportFile} 
            accept=".json,application/json" 
            style={{ display: 'none' }} 
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Upload size={15} style={{ color: 'var(--accent-blue)' }} />
            <span>Restore JSON</span>
          </button>

          <button
            onClick={handleExportBackup}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gold-grad)',
              color: '#1e293b',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
            }}
          >
            {exportSuccess ? <Check size={16} /> : <Download size={15} />}
            <span>{exportSuccess ? 'Backup Downloaded!' : 'Export Backup'}</span>
          </button>
        </div>
      </div>

      {/* Import Feedback Toast */}
      {importFeedback && (
        <div className="card fade-in" style={{
          padding: '12px 18px',
          marginBottom: '16px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          color: '#15803d',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={18} />
          <span>{importFeedback}</span>
        </div>
      )}

      {/* Multi-Device JSON Backup Reminder Banner */}
      {showReminder && totalItemsCount > 0 && (
        <div className="card fade-in" style={{
          padding: '16px 20px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.12) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-md)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                background: 'var(--accent-gold)',
                color: 'white',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex'
              }}>
                <HardDriveDownload size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Multi-Device Offline Backup Reminder
                </h3>
                <p style={{ margin: '4px 0 10px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '560px' }}>
                  You have <strong>{totalItemsCount} items</strong> stored in this browser. To sync across other phones, tablets, or protect against cache clearing, save an offline JSON backup.
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={handleExportBackup}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-gold)',
                      color: 'white',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Backup Now (JSON)
                  </button>
                  <button
                    onClick={dismissReminder}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: '4px 8px'
                    }}
                  >
                    Remind me in 14 days
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={dismissReminder}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('verses')}
          style={{ 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: activeTab === 'verses' ? 'var(--accent-gold)' : 'var(--bg-card)',
            color: activeTab === 'verses' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: `1px solid ${activeTab === 'verses' ? 'var(--accent-gold)' : 'var(--border-color)'}`,
            boxShadow: activeTab === 'verses' ? 'var(--shadow-md)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} />
          <span>Saved Verses ({savedVerses.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('notes')}
          style={{ 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: activeTab === 'notes' ? 'var(--accent-purple, #8b5cf6)' : 'var(--bg-card)',
            color: activeTab === 'notes' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: `1px solid ${activeTab === 'notes' ? 'var(--accent-purple, #8b5cf6)' : 'var(--border-color)'}`,
            boxShadow: activeTab === 'notes' ? 'var(--shadow-md)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <FileText size={16} />
          <span>Notes ({totalNotesCount})</span>
        </button>

        <button 
          onClick={() => setActiveTab('chapters')}
          style={{ 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: activeTab === 'chapters' ? 'var(--accent-blue)' : 'var(--bg-card)',
            color: activeTab === 'chapters' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: `1px solid ${activeTab === 'chapters' ? 'var(--accent-blue)' : 'var(--border-color)'}`,
            boxShadow: activeTab === 'chapters' ? 'var(--shadow-md)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Bookmark size={16} />
          <span>Bookmarks ({bookmarkedChapters.length})</span>
        </button>
      </div>

      {/* =========================================
          TAB 1: SAVED VERSES
          ========================================= */}
      {activeTab === 'verses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Filter Bar for Verses */}
          {savedVerses.length > 0 && (
            <div className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              {/* Color swatches filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'gold', label: 'Gold', color: '#f59e0b' },
                  { id: 'emerald', label: 'Emerald', color: '#10b981' },
                  { id: 'sky', label: 'Sky', color: '#0ea5e9' },
                  { id: 'rose', label: 'Rose', color: '#f43f5e' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setColorFilter(c.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: colorFilter === c.id ? 'var(--accent-gold)' : 'var(--border-color)',
                      backgroundColor: colorFilter === c.id ? 'var(--accent-gold-light)' : 'var(--bg-secondary)',
                      color: colorFilter === c.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {c.color && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color }} />}
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>

              {/* Search query in verses */}
              <div style={{ position: 'relative', minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved verses..."
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {savedVerses.length === 0 ? (
            <div className="placeholder-text card" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <Sparkles size={36} style={{ color: 'var(--accent-gold)', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)' }}>No Highlighted Verses Yet</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Tap on any verse in the Bible reader to select and highlight with your favorite color.
              </p>
              <Link href="/bible" style={{ display: 'inline-block', marginTop: '16px', padding: '8px 18px', background: 'var(--accent-gold)', color: '#fff', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                Go to Bible Reader
              </Link>
            </div>
          ) : filteredVerses.length === 0 ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No verses match your current filter.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredVerses.map((v, i) => {
                const color = v.color || 'gold';
                const { book, chapter } = parseRef(v.ref);

                return (
                  <div 
                    key={i} 
                    className="card fade-in" 
                    style={{ 
                      padding: '20px',
                      borderLeft: `4px solid ${
                        color === 'emerald' ? '#10b981' :
                        color === 'sky' ? '#0ea5e9' :
                        color === 'rose' ? '#f43f5e' : '#f59e0b'
                      }`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>
                          {v.ref}
                        </h3>
                        <span style={{ 
                          fontSize: '0.68rem', 
                          backgroundColor: 'var(--bg-secondary)', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          color: 'var(--text-secondary)', 
                          textTransform: 'uppercase', 
                          fontWeight: 700 
                        }}>
                          {v.lang || 'kjv'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link 
                          href={`/bible?book=${encodeURIComponent(book)}&chapter=${chapter}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--accent-blue)',
                            fontWeight: 600,
                            padding: '6px 12px',
                            backgroundColor: 'var(--accent-blue-light)',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            fontSize: '0.8rem'
                          }}
                        >
                          <BookOpen size={14} /> Read Context
                        </Link>
                      </div>
                    </div>
                    
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '16px', lineHeight: 1.6, fontStyle: 'italic' }}>
                      &ldquo;{v.text}&rdquo;
                    </p>
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <button 
                        onClick={() => shareVerse(v)} 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 600, padding: '6px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        <Share2 size={14} /> Share
                      </button>
                      <button 
                        onClick={() => removeVerse(v.ref, v.text)} 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600, padding: '6px 12px', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================
          TAB 2: STUDY NOTES
          ========================================= */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Notes Sub-filter & Search */}
          <div className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: `All (${totalNotesCount})` },
                { id: 'verse', label: `Verses (${Object.keys(verseNotes).length})` },
                { id: 'chapter', label: `Chapters (${Object.keys(chapterNotes).length})` },
                { id: 'book', label: `Books (${Object.keys(bookNotes).length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setNoteTypeFilter(f.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: noteTypeFilter === f.id ? 'var(--accent-purple, #8b5cf6)' : 'var(--border-color)',
                    backgroundColor: noteTypeFilter === f.id ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-secondary)',
                    color: noteTypeFilter === f.id ? 'var(--accent-purple, #8b5cf6)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes content..."
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {totalNotesCount === 0 ? (
            <div className="placeholder-text card" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <FileText size={36} style={{ color: 'var(--accent-purple, #8b5cf6)', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)' }}>No Notes Written Yet</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Add your reflections on any verse in the Bible reader or on chapters in the Study guide.
              </p>
            </div>
          ) : combinedNotes.length === 0 ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No notes match your search.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {combinedNotes.map((item, idx) => {
                const { book, chapter } = parseRef(item.ref);
                const isEditing = editingNoteKey === item.key && editingNoteType === item.type;

                return (
                  <div key={idx} className="card fade-in" style={{ padding: '20px', borderLeft: '4px solid var(--accent-purple, #8b5cf6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                          {item.ref}
                        </h3>
                        <span style={{ 
                          fontSize: '0.68rem', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          backgroundColor: 'rgba(139, 92, 246, 0.15)', 
                          color: 'var(--accent-purple, #8b5cf6)',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {item.label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/bible?book=${encodeURIComponent(book)}&chapter=${chapter}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--accent-blue)',
                            fontWeight: 600,
                            padding: '6px 10px',
                            backgroundColor: 'var(--accent-blue-light)',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            fontSize: '0.8rem'
                          }}
                        >
                          <BookOpen size={14} /> Read
                        </Link>
                      </div>
                    </div>

                    {/* Note Content / Inline Editor */}
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        <textarea
                          className="note-editor"
                          rows={3}
                          value={editingNoteText}
                          onChange={(e) => setEditingNoteText(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setEditingNoteKey(null)}
                            style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEditedNote}
                            style={{ padding: '5px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-blue)', color: 'white', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ margin: '0 0 16px', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                        {item.text}
                      </p>
                    )}

                    {!isEditing && (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                        <button
                          onClick={() => {
                            setEditingNoteKey(item.key);
                            setEditingNoteType(item.type);
                            setEditingNoteText(item.text);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', padding: '5px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: '0.78rem' }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => deleteNote(item.type, item.key)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', padding: '5px 10px', borderRadius: 'var(--radius-sm)', border: 'none', background: '#fef2f2', cursor: 'pointer', fontSize: '0.78rem' }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================
          TAB 3: BOOKMARKS
          ========================================= */}
      {activeTab === 'chapters' && (
        <>
          {bookmarkedChapters.length === 0 ? (
            <div className="placeholder-text card" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <Bookmark size={36} style={{ color: 'var(--accent-blue)', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)' }}>No Chapter Bookmarks</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Bookmark entire chapters in the Bible reader to pick up right where you left off.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {bookmarkedChapters.map((b, i) => {
                const { book, chapter } = parseRef(b.ref);

                return (
                  <div key={i} className="card fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
                    <Bookmark size={32} style={{ color: 'var(--accent-blue)', fill: 'var(--accent-blue)', fillOpacity: 0.2 }} />
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, textAlign: 'center', fontWeight: 700 }}>
                      {b.ref}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <Link 
                        href={`/bible?book=${encodeURIComponent(book)}&chapter=${chapter}`} 
                        style={{ 
                          flex: 1, 
                          textAlign: 'center', 
                          padding: '8px', 
                          backgroundColor: 'var(--accent-blue)', 
                          color: '#fff', 
                          borderRadius: 'var(--radius-sm)', 
                          fontWeight: 600, 
                          textDecoration: 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        Read
                      </Link>
                      <button 
                        onClick={() => removeBookmark(b.ref)} 
                        style={{ 
                          padding: '8px 12px', 
                          backgroundColor: '#fef2f2', 
                          color: '#ef4444', 
                          borderRadius: 'var(--radius-sm)', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                        title="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
}
