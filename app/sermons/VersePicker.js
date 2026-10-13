'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Loader2, BookOpen } from 'lucide-react';
import { offlineTranslations } from '../data/translations';
import { parseReference, formatReference } from '../data/books';
import { fetchTranslationData, getChapterVerses, translationFilename, translationShortName } from '../lib/bibleData';
import { renderRedLetter } from '../lib/verseText';
import { newId } from '../lib/sermonStore';

// The reader's current translation is the natural default for inserted verses
const preferredTranslation = () => {
  try {
    const lastRead = JSON.parse(localStorage.getItem('cw_last_read'));
    if (offlineTranslations.some(t => t.id === lastRead?.primaryLang)) return lastRead.primaryLang;
  } catch (e) {}
  return 'kjv_offline';
};

// Loads the verses for a parsed reference; a whole chapter if no verses were given
export const loadPassage = async (reference, translationId) => {
  const data = await fetchTranslationData(translationFilename(translationId));
  const all = getChapterVerses(data, reference.book, reference.chapter);
  const verses = reference.verseStart
    ? all.filter(v => v.verseNum >= reference.verseStart && v.verseNum <= reference.verseEnd)
    : all;
  return verses.map(v => ({ n: v.verseNum, text: v.text }));
};

export default function VersePicker({ onClose, onInsert, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [translation, setTranslation] = useState('kjv_offline');
  const [preview, setPreview] = useState(null); // { reference, verses }
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTranslation(preferredTranslation());
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Look the passage up as the pastor types (after a short pause)
  useEffect(() => {
    setError('');
    if (!query.trim()) { setPreview(null); return; }
    const reference = parseReference(query);
    if (!reference) { setPreview(null); return; }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const verses = await loadPassage(reference, translation);
        if (cancelled) return;
        if (verses.length === 0) {
          setPreview(null);
          setError(`${formatReference(reference)} isn't in this translation.`);
        } else {
          setPreview({ reference, verses });
        }
      } catch (e) {
        if (!cancelled) {
          setPreview(null);
          setError(`${formatReference(reference)} isn't in this translation.`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query, translation]);

  const handleInsert = (e) => {
    e.preventDefault();
    if (!query.trim()) { setError('Type a reference, like John 3:16'); return; }
    if (!parseReference(query)) { setError("That reference wasn't recognised. Try a format like Rom 8:28 or Psalm 23."); return; }
    if (!preview) return;
    onInsert({
      id: newId(),
      type: 'verse',
      ref: formatReference(preview.reference),
      translation,
      translationLabel: translationShortName(translation),
      verses: preview.verses,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Insert a Bible verse"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: '16px' }}
    >
      <form onSubmit={handleInsert} className="card" style={{ width: '100%', maxWidth: '520px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} aria-hidden="true" style={{ color: 'var(--accent-blue)' }} />
            Insert verse
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="icon-btn" style={{ boxShadow: 'none' }}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '8px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Reference
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="John 3:16-18"
              className="sermon-input"
              autoComplete="off"
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Translation
            <select value={translation} onChange={(e) => setTranslation(e.target.value)} className="sermon-input" style={{ width: '130px' }}>
              {offlineTranslations.map(t => <option key={t.id} value={t.id}>{translationShortName(t.id)}</option>)}
            </select>
          </label>
        </div>

        <div style={{ overflowY: 'auto', minHeight: '80px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          {loading && <Loader2 size={18} className="spin" aria-label="Loading passage" style={{ color: 'var(--accent-blue)' }} />}
          {!loading && preview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--accent-blue)' }}>
                {formatReference(preview.reference)} · {translationShortName(translation)}
              </strong>
              {preview.verses.map(v => (
                <p key={v.n} style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  <sup style={{ color: 'var(--text-tertiary)', marginRight: '4px' }}>{v.n}</sup>
                  {renderRedLetter(v.text)}
                </p>
              ))}
            </div>
          )}
          {!loading && !preview && !error && (
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Type a reference such as <em>Rom 8:28</em>, <em>Psalm 23</em> or <em>1 Cor 13:4-7</em>. A chapter on its own inserts the whole chapter.
            </p>
          )}
          {error && <p role="alert" style={{ margin: 0, fontSize: '0.88rem', color: 'var(--danger)' }}>{error}</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" onClick={onClose} className="sermon-btn">Cancel</button>
          <button type="submit" className="sermon-btn sermon-btn-primary" disabled={!preview || loading}>
            Insert {preview ? `(${preview.verses.length} ${preview.verses.length === 1 ? 'verse' : 'verses'})` : ''}
          </button>
        </div>
      </form>
    </div>
  );
}
