'use client';
import { useState, useEffect } from 'react';

export default function SavedItems() {
  const [savedVerses, setSavedVerses] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cw_saved_verses')) || [];
    setSavedVerses(saved);
  }, []);

  const removeVerse = (ref) => {
    const newSaved = savedVerses.filter(v => v.ref !== ref);
    setSavedVerses(newSaved);
    localStorage.setItem('cw_saved_verses', JSON.stringify(newSaved));
  };

  const shareVerse = (verse) => {
    const text = `"${verse.text}" - ${verse.ref} (via Chosen Word App)`;
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
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)' }}>Saved Verses</h2>
      
      {savedVerses.length === 0 ? (
        <div className="placeholder-text">You haven't saved any verses yet. Go to the Bible reader and tap a verse to save it!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {savedVerses.map(v => (
            <div key={v.ref} style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', marginBottom: '8px' }}>{v.ref}</h3>
              <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>"{v.text}"</p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => shareVerse(v)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>share</span> Share
                </button>
                <button onClick={() => removeVerse(v.ref)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>delete</span> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
