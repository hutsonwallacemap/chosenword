'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, NotebookPen, Loader2 } from 'lucide-react';
import { listSermons, createSermon, saveSermon, newId } from '../lib/sermonStore';
import { formatReference } from '../data/books';
import { translationShortName } from '../lib/bibleData';

// "John 3:16-18" for a run of verses, "John 3:16, 18, 20" otherwise
export const describeVerses = (book, chapter, nums) => {
  const sorted = [...nums].sort((a, b) => a - b);
  const isRun = sorted.every((n, i) => i === 0 || n === sorted[i - 1] + 1);
  return isRun
    ? formatReference({ book, chapter, verseStart: sorted[0], verseEnd: sorted[sorted.length - 1] })
    : `${book} ${chapter}:${sorted.join(', ')}`;
};

// Lets the reader send selected verses to an existing sermon or start a new one
export default function AddToSermon({ book, chapter, verses, translationId, onClose, onAdded }) {
  const router = useRouter();
  const [sermons, setSermons] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const ref = describeVerses(book, chapter, verses.map(v => v.n));
  const makeBlock = () => ({
    id: newId(),
    type: 'verse',
    ref,
    book,
    chapter,
    verseNums: verses.map(v => v.n),
    translation: translationId,
    translationLabel: translationShortName(translationId),
    verses,
  });

  useEffect(() => {
    listSermons().then(setSermons).catch(() => { setSermons([]); setError('Sermons could not be loaded on this device.'); });
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const addTo = async (sermon) => {
    setBusy(true);
    try {
      await saveSermon({ ...sermon, blocks: [...(sermon.blocks || []), makeBlock()] });
      onAdded(sermon);
    } catch (e) {
      setError('The verses could not be added. Please try again.');
      setBusy(false);
    }
  };

  const startNew = async () => {
    setBusy(true);
    try {
      const sermon = await createSermon({
        mainPassage: ref,
        blocks: [{ id: newId(), type: 'point', text: '' }, makeBlock()],
      });
      router.push(`/sermons/edit?id=${sermon.id}`);
    } catch (e) {
      setError('A new sermon could not be created.');
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Add ${ref} to a sermon`}
      onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: '16px' }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '440px', maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Add to sermon</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ref} · {translationShortName(translationId)}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="icon-btn" style={{ boxShadow: 'none' }}><X size={18} aria-hidden="true" /></button>
        </div>

        <button onClick={startNew} disabled={busy} className="sermon-btn sermon-btn-primary" style={{ minHeight: '44px' }}>
          <Plus size={16} aria-hidden="true" /> New sermon with these verses
        </button>

        {error && <p role="alert" style={{ margin: 0, color: 'var(--danger)', fontSize: '0.88rem' }}>{error}</p>}
        {sermons === null && <Loader2 size={18} className="spin" aria-label="Loading sermons" />}
        {sermons && sermons.length > 0 && (
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' }}>Or add to the end of</span>
        )}
        {sermons && sermons.map(s => (
          <button key={s.id} onClick={() => addTo(s)} disabled={busy} className="sermon-menu-item" style={{ border: '1px solid var(--border-color)' }}>
            <NotebookPen size={16} aria-hidden="true" style={{ color: 'var(--accent-gold-text)', flexShrink: 0 }} />
            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title || 'Untitled sermon'}</span>
              {s.mainPassage && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.mainPassage}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
