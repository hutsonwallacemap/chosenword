'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SavedItems() {
  const [activeTab, setActiveTab] = useState('verses'); // 'verses' or 'chapters'
  const [savedVerses, setSavedVerses] = useState([]);
  const [bookmarkedChapters, setBookmarkedChapters] = useState([]);

  useEffect(() => {
    setSavedVerses(JSON.parse(localStorage.getItem('cw_saved_verses')) || []);
    setBookmarkedChapters(JSON.parse(localStorage.getItem('cw_bookmarks')) || []);
  }, []);

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

  const shareVerse = (verse) => {
    const text = `"${verse.text}" - ${verse.ref} (${verse.lang.toUpperCase()}) | via Chosen Word`;
    if (navigator.share) {
      navigator.share({
        title: 'Share Verse',
        text: text,
      }).catch(console.error);
    } else {
      alert(`Copy this verse to share:\n\n${text}`);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)', background: 'var(--accent-gold-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Your Collection
      </h2>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('verses')}
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: activeTab === 'verses' ? 'var(--accent-gold)' : 'var(--bg-card)',
            color: activeTab === 'verses' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            border: `1px solid ${activeTab === 'verses' ? 'var(--accent-gold)' : 'var(--border-color)'}`,
            boxShadow: activeTab === 'verses' ? 'var(--shadow-md)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          Saved Verses
        </button>
        <button 
          onClick={() => setActiveTab('chapters')}
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            backgroundColor: activeTab === 'chapters' ? 'var(--accent-blue)' : 'var(--bg-card)',
            color: activeTab === 'chapters' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700,
            border: `1px solid ${activeTab === 'chapters' ? 'var(--accent-blue)' : 'var(--border-color)'}`,
            boxShadow: activeTab === 'chapters' ? 'var(--shadow-md)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          Bookmarks
        </button>
      </div>

      {/* Verses Tab */}
      {activeTab === 'verses' && (
        <>
          {savedVerses.length === 0 ? (
            <div className="placeholder-text card">You haven't highlighted any verses yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {savedVerses.map((v, i) => (
                <div key={i} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', margin: 0 }}>{v.ref}</h3>
                    <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {v.lang}
                    </span>
                  </div>
                  
                  <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: 1.5 }}>"{v.text}"</p>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button onClick={() => shareVerse(v)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', fontWeight: 600, padding: '8px 12px', backgroundColor: 'var(--accent-blue-light)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>share</span> Share
                    </button>
                    <button onClick={() => removeVerse(v.ref, v.text)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600, padding: '8px 12px', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-sm)' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Chapters Tab */}
      {activeTab === 'chapters' && (
        <>
          {bookmarkedChapters.length === 0 ? (
            <div className="placeholder-text card">You haven't bookmarked any chapters yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {bookmarkedChapters.map((b, i) => (
                <div key={i} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, textAlign: 'center' }}>{b.ref}</h3>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <Link href="/bible" style={{ flex: 1, textAlign: 'center', padding: '8px', backgroundColor: 'var(--accent-blue)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none' }}>
                      Read
                    </Link>
                    <button onClick={() => removeBookmark(b.ref)} style={{ padding: '8px 12px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: 'var(--radius-sm)' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
