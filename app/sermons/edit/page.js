'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Check, Loader2, Plus, BookOpen, Heading, AlignLeft, ArrowUp, ArrowDown, Trash2,
  Presentation, Printer, FileDown, Share2, History, MoreVertical, X, AlertCircle, ChevronDown,
} from 'lucide-react';
import {
  getSermon, saveSermon, trashSermon, snapshotVersion, listVersions, newId, sermonPlainText, formatSermonDate, SERMON_STATUSES,
} from '../../lib/sermonStore';
import { parseReference } from '../../data/books';
import { offlineTranslations } from '../../data/translations';
import { translationShortName } from '../../lib/bibleData';
import { renderRedLetter, stripRedLetterMarks } from '../../lib/verseText';
import VersePicker, { loadPassage } from '../VersePicker';

const AUTOSAVE_DELAY_MS = 800;
const WORDS_PER_MINUTE = 130; // typical preaching pace

// Textarea that grows with its content instead of scrolling inside itself
function AutoTextarea({ value, onChange, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  return <textarea ref={ref} value={value} onChange={onChange} rows={2} {...props} />;
}

const countWords = (sermon) =>
  sermonPlainText(sermon).split(/\s+/).filter(Boolean).length;

const escapeHtml = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Word opens HTML saved with a .doc extension, so no extra library is needed
const sermonToWordHtml = (sermon) => {
  const body = (sermon.blocks || []).map(block => {
    if (block.type === 'point') return `<h2>${escapeHtml(block.text)}</h2>`;
    if (block.type === 'text') return `<p>${escapeHtml(block.text).replace(/\n/g, '<br>')}</p>`;
    if (block.type === 'verse') {
      const verses = (block.verses || []).map(v => `<sup>${v.n}</sup> ${escapeHtml(stripRedLetterMarks(v.text))}`).join(' ');
      return `<blockquote><p>${verses}</p><p><b>${escapeHtml(block.ref)}</b> (${escapeHtml(block.translationLabel || '')})</p></blockquote>`;
    }
    return '';
  }).join('\n');
  const meta = [sermon.mainPassage, formatSermonDate(sermon.date), sermon.place].filter(Boolean).map(escapeHtml).join(' · ');
  return `<html><head><meta charset="utf-8"><title>${escapeHtml(sermon.title)}</title>
<style>body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5}h1{font-size:20pt}h2{font-size:14pt;margin-top:18pt}blockquote{border-left:3pt solid #b45309;margin-left:0;padding-left:10pt;color:#333}</style>
</head><body><h1>${escapeHtml(sermon.title || 'Untitled sermon')}</h1><p><i>${meta}</i></p>${body}</body></html>`;
};

const safeFilename = (title) => (title || 'sermon').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'sermon';

export default function SermonEditor() {
  const router = useRouter();
  const [sermon, setSermon] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [saveState, setSaveState] = useState('saved'); // 'saved' | 'pending' | 'saving' | 'error'
  const [pickerFor, setPickerFor] = useState(null); // index to insert after, or null
  const [menuOpen, setMenuOpen] = useState(false);
  const [versions, setVersions] = useState(null); // array when the history dialog is open
  const [tagDraft, setTagDraft] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toast, setToast] = useState('');

  const latestRef = useRef(null);   // newest edited sermon, not yet saved
  const timerRef = useRef(null);
  const savingRef = useRef(Promise.resolve());

  // ---------- Load ----------
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { setNotFound(true); return; }
    getSermon(id).then(found => {
      if (!found || found.deletedAt) { setNotFound(true); return; }
      setSermon(found);
      // New sermons start with the details open; existing ones go straight to the outline
      setDetailsOpen(!found.title);
      // Keep a copy of how the sermon looked before this editing session
      snapshotVersion(found).catch(() => {});
    }).catch(() => setNotFound(true));
  }, []);

  // ---------- Autosave ----------
  const flush = useCallback(async () => {
    clearTimeout(timerRef.current);
    const pending = latestRef.current;
    if (!pending) return savingRef.current;
    latestRef.current = null;
    setSaveState('saving');
    savingRef.current = savingRef.current.then(async () => {
      try {
        const saved = await saveSermon(pending);
        if (!latestRef.current) setSaveState('saved');
        snapshotVersion(saved).catch(() => {}); // at most one snapshot every 10 minutes
      } catch (e) {
        latestRef.current = latestRef.current || pending; // keep it and try again shortly
        setSaveState('error');
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(flush, 3000);
      }
    });
    return savingRef.current;
  }, []);

  const update = useCallback((changes) => {
    setSermon(prev => {
      const next = typeof changes === 'function' ? changes(prev) : { ...prev, ...changes };
      latestRef.current = next;
      return next;
    });
    setSaveState('pending');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, AUTOSAVE_DELAY_MS);
  }, [flush]);

  // Save immediately if the app is hidden, closed or navigated away from
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    const onPageHide = () => flush();
    const onBeforeUnload = (e) => {
      if (latestRef.current) { flush(); e.preventDefault(); }
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
      flush();
    };
  }, [flush]);

  // Esc closes the top dialog
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (versions) setVersions(null);
      else if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [versions, menuOpen]);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(''), 2500);
  };

  // ---------- Blocks ----------
  const updateBlock = (id, changes) =>
    update(prev => ({ ...prev, blocks: prev.blocks.map(b => (b.id === id ? { ...b, ...changes } : b)) }));

  const insertBlock = (block, afterIndex) =>
    update(prev => {
      const blocks = [...prev.blocks];
      const at = afterIndex === undefined || afterIndex === null ? blocks.length : afterIndex + 1;
      blocks.splice(at, 0, block);
      return { ...prev, blocks };
    });

  const addBlock = (type) => {
    if (type === 'verse') { setPickerFor(sermon.blocks.length - 1); return; }
    const block = { id: newId(), type, text: '' };
    insertBlock(block);
    // Focus the new field once it renders
    setTimeout(() => document.getElementById(`block-${block.id}`)?.focus(), 50);
  };

  const moveBlock = (index, direction) =>
    update(prev => {
      const blocks = [...prev.blocks];
      const target = index + direction;
      if (target < 0 || target >= blocks.length) return prev;
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...prev, blocks };
    });

  const removeBlock = (block) => {
    const hasContent = block.type === 'verse' || (block.text || '').trim();
    if (hasContent && !window.confirm('Remove this section?')) return;
    update(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== block.id) }));
  };

  const changeVerseTranslation = async (block, translationId) => {
    // Verses sent from the reader carry book/chapter/verseNums (they can be non-consecutive)
    const reference = block.verseNums && block.book
      ? { book: block.book, chapter: block.chapter, verseStart: Math.min(...block.verseNums), verseEnd: Math.max(...block.verseNums) }
      : parseReference(block.ref);
    if (!reference) return;
    try {
      let verses = await loadPassage(reference, translationId);
      if (block.verseNums) verses = verses.filter(v => block.verseNums.includes(v.n));
      if (verses.length === 0) { showToast(`${block.ref} isn't in that translation`); return; }
      updateBlock(block.id, { translation: translationId, translationLabel: translationShortName(translationId), verses });
    } catch (e) {
      showToast('That translation could not be loaded');
    }
  };

  // ---------- Tags ----------
  const addTag = () => {
    const tag = tagDraft.trim().replace(/^#/, '');
    setTagDraft('');
    if (!tag || (sermon.tags || []).includes(tag)) return;
    update(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
  };

  // ---------- Menu actions ----------
  const goToPreach = async (print = false) => {
    await flush();
    router.push(`/sermons/preach?id=${sermon.id}${print ? '&print=1' : ''}`);
  };

  const downloadWord = () => {
    const blob = new Blob(['﻿', sermonToWordHtml(sermon)], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename(sermon.title)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const share = async () => {
    setMenuOpen(false);
    const text = stripRedLetterMarks(sermonPlainText(sermon));
    try {
      if (navigator.share) await navigator.share({ title: sermon.title || 'Sermon', text });
      else { await navigator.clipboard.writeText(text); showToast('Sermon copied to clipboard'); }
    } catch (e) {}
  };

  const openHistory = async () => {
    setMenuOpen(false);
    await flush();
    setVersions(await listVersions(sermon.id));
  };

  const restoreVersion = async (version) => {
    if (!window.confirm(`Restore the version from ${new Date(version.savedAt).toLocaleString()}? Your current text is kept in history.`)) return;
    await snapshotVersion(sermon, { force: true });
    const { id, createdAt, deletedAt } = sermon;
    update({ ...version.sermon, id, createdAt, deletedAt });
    setVersions(null);
    showToast('Version restored');
  };

  const moveToTrash = async () => {
    setMenuOpen(false);
    if (!window.confirm('Move this sermon to Trash? You can restore it for 30 days.')) return;
    await flush();
    await trashSermon(sermon.id);
    router.push('/sermons');
  };

  // ---------- Render ----------
  if (notFound) {
    return (
      <div className="card" style={{ maxWidth: '560px', margin: '40px auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <AlertCircle size={32} aria-hidden="true" style={{ color: 'var(--text-secondary)' }} />
        <strong>This sermon isn't on this device</strong>
        <span style={{ color: 'var(--text-secondary)' }}>It may have been deleted, or it was written on another device.</span>
        <Link href="/sermons" className="sermon-btn">Back to sermons</Link>
      </div>
    );
  }
  if (!sermon) return <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '40px' }}>Loading sermon…</div>;

  const words = countWords(sermon);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  const passageRef = parseReference(sermon.mainPassage);
  let pointNumber = 0;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <Link href="/sermons" aria-label="Back to sermons" className="icon-btn" style={{ boxShadow: 'none' }}>
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <span role="status" aria-live="polite" style={{ fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', color: saveState === 'error' ? 'var(--danger)' : 'var(--text-secondary)' }}>
          {saveState === 'saved' && <><Check size={14} aria-hidden="true" style={{ color: 'var(--success)' }} /> Saved</>}
          {(saveState === 'pending' || saveState === 'saving') && <><Loader2 size={14} className="spin" aria-hidden="true" /> Saving…</>}
          {saveState === 'error' && <><AlertCircle size={14} aria-hidden="true" /> Not saved — retrying</>}
        </span>
        <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
          <button onClick={() => goToPreach(false)} className="sermon-btn sermon-btn-primary" style={{ minHeight: '44px' }}>
            <Presentation size={16} aria-hidden="true" /> Preach
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="More options" aria-expanded={menuOpen} className="icon-btn" style={{ boxShadow: 'none' }}>
            <MoreVertical size={20} aria-hidden="true" />
          </button>
          {menuOpen && (
            <div role="menu" className="card" style={{ position: 'absolute', right: 0, top: '52px', zIndex: 50, padding: '6px', minWidth: '220px', display: 'flex', flexDirection: 'column' }}>
              <button role="menuitem" className="sermon-menu-item" onClick={() => goToPreach(true)}><Printer size={16} aria-hidden="true" /> Print or save as PDF</button>
              <button role="menuitem" className="sermon-menu-item" onClick={downloadWord}><FileDown size={16} aria-hidden="true" /> Download for Word</button>
              <button role="menuitem" className="sermon-menu-item" onClick={share}><Share2 size={16} aria-hidden="true" /> Share text</button>
              <button role="menuitem" className="sermon-menu-item" onClick={openHistory}><History size={16} aria-hidden="true" /> Version history</button>
              <button role="menuitem" className="sermon-menu-item" style={{ color: 'var(--danger)' }} onClick={moveToTrash}><Trash2 size={16} aria-hidden="true" /> Move to Trash</button>
            </div>
          )}
        </div>
      </div>

      {/* Title and details */}
      <input
        value={sermon.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Sermon title"
        aria-label="Sermon title"
        className="sermon-title-input"
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <button onClick={() => setDetailsOpen(!detailsOpen)} aria-expanded={detailsOpen} className="sermon-details-toggle">
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {[sermon.mainPassage, formatSermonDate(sermon.date), sermon.place, sermon.series].filter(Boolean).join(' · ') || 'Add passage, date, church and tags'}
          </span>
          <ChevronDown size={18} aria-hidden="true" style={{ flexShrink: 0, transform: detailsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </button>
        {detailsOpen && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', padding: '0 16px 16px' }}>
            <label className="sermon-field">Main passage
              <input value={sermon.mainPassage} onChange={(e) => update({ mainPassage: e.target.value })} placeholder="Luke 15:11-32" className="sermon-input" />
            </label>
            <label className="sermon-field">Date
              <input type="date" value={sermon.date} onChange={(e) => update({ date: e.target.value })} className="sermon-input" />
            </label>
            <label className="sermon-field">Church or event
              <input value={sermon.place} onChange={(e) => update({ place: e.target.value })} placeholder="Sunday service" className="sermon-input" />
            </label>
            <label className="sermon-field">Series
              <input value={sermon.series} onChange={(e) => update({ series: e.target.value })} placeholder="Book of Acts" className="sermon-input" />
            </label>
            <label className="sermon-field">Status
              <select value={sermon.status} onChange={(e) => update({ status: e.target.value })} className="sermon-input">
                {SERMON_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <label className="sermon-field">Planned length (min)
              <input type="number" min="1" max="240" value={sermon.targetMinutes} onChange={(e) => update({ targetMinutes: Math.max(1, parseInt(e.target.value) || 1) })} className="sermon-input" />
            </label>
            <div className="sermon-field" style={{ gridColumn: '1 / -1' }}>
              Tags
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                {(sermon.tags || []).map(tag => (
                  <span key={tag} className="sermon-chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    #{tag}
                    <button onClick={() => update(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} aria-label={`Remove tag ${tag}`} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                      <X size={13} aria-hidden="true" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                  onBlur={addTag}
                  placeholder="Add tag (Sunday, Youth…)"
                  aria-label="Add a tag"
                  className="sermon-input"
                  style={{ flex: '1 1 160px', minWidth: '140px' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0 4px' }}>
        {words} words · about {minutes} min to preach{sermon.targetMinutes ? ` (planned ${sermon.targetMinutes} min)` : ''}
        {passageRef && (
          <> · <Link href={`/bible?book=${encodeURIComponent(passageRef.book)}&chapter=${passageRef.chapter}${passageRef.verseStart ? `&verse=${passageRef.verseStart}` : ''}`} style={{ color: 'var(--accent-blue)' }}>Open passage in Bible</Link></>
        )}
      </div>

      {/* Outline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sermon.blocks.map((block, index) => {
          if (block.type === 'point') pointNumber++;
          return (
            <div key={block.id} className={`sermon-block sermon-block-${block.type}`}>
              <div className="sermon-block-body">
                {block.type === 'point' && (
                  <>
                    <span className="sermon-block-label">Point {pointNumber}</span>
                    <input
                      id={`block-${block.id}`}
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      placeholder="Main point heading"
                      aria-label={`Point ${pointNumber} heading`}
                      className="sermon-point-input"
                    />
                  </>
                )}
                {block.type === 'text' && (
                  <AutoTextarea
                    id={`block-${block.id}`}
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    placeholder="Explanation, story, illustration, application…"
                    aria-label="Notes"
                    className="sermon-textarea"
                  />
                )}
                {block.type === 'verse' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ color: 'var(--accent-gold-text)' }}>{block.ref}</strong>
                      <select
                        value={block.translation}
                        onChange={(e) => changeVerseTranslation(block, e.target.value)}
                        aria-label={`Translation for ${block.ref}`}
                        className="sermon-input"
                        style={{ width: 'auto', minHeight: '36px', padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        {offlineTranslations.map(t => <option key={t.id} value={t.id}>{translationShortName(t.id)}</option>)}
                      </select>
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.7, fontFamily: 'Georgia, serif' }}>
                      {(block.verses || []).map(v => (
                        <span key={v.n}><sup style={{ color: 'var(--text-secondary)' }}>{v.n}</sup> {renderRedLetter(v.text)} </span>
                      ))}
                    </p>
                  </>
                )}
              </div>
              <div className="sermon-block-tools">
                <button onClick={() => moveBlock(index, -1)} disabled={index === 0} aria-label="Move up" className="sermon-tool"><ArrowUp size={16} aria-hidden="true" /></button>
                <button onClick={() => moveBlock(index, 1)} disabled={index === sermon.blocks.length - 1} aria-label="Move down" className="sermon-tool"><ArrowDown size={16} aria-hidden="true" /></button>
                <button onClick={() => setPickerFor(index)} aria-label="Insert verse below" className="sermon-tool"><BookOpen size={16} aria-hidden="true" /></button>
                <button onClick={() => removeBlock(block)} aria-label="Remove section" className="sermon-tool" style={{ color: 'var(--danger)' }}><Trash2 size={16} aria-hidden="true" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add bar */}
      <div className="card" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px', justifyContent: 'center' }}>
        <span style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Plus size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Add to outline
        </span>
        <button onClick={() => addBlock('point')} className="sermon-btn"><Heading size={16} aria-hidden="true" /> Point</button>
        <button onClick={() => addBlock('text')} className="sermon-btn"><AlignLeft size={16} aria-hidden="true" /> Notes</button>
        <button onClick={() => addBlock('verse')} className="sermon-btn"><BookOpen size={16} aria-hidden="true" /> Verse</button>
      </div>

      {pickerFor !== null && (
        <VersePicker
          onClose={() => setPickerFor(null)}
          onInsert={(block) => { insertBlock(block, pickerFor); setPickerFor(null); }}
        />
      )}

      {versions && (
        <div role="dialog" aria-modal="true" aria-label="Version history" onClick={(e) => { if (e.target === e.currentTarget) setVersions(null); }}
          style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Version history</h3>
              <button onClick={() => setVersions(null)} aria-label="Close" className="icon-btn" style={{ boxShadow: 'none' }}><X size={18} aria-hidden="true" /></button>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              A copy is kept each time you open this sermon and every 10 minutes while you write (last 30 copies).
            </p>
            {versions.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No earlier versions yet.</p>}
            {versions.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{new Date(v.savedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{v.sermon.title || 'Untitled'} · {countWords(v.sermon)} words</div>
                </div>
                <button className="sermon-btn" onClick={() => restoreVersion(v)}>Restore</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div role="status" style={{ position: 'fixed', bottom: '96px', left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '10px 18px', borderRadius: '99px', fontSize: '0.88rem', fontWeight: 600, zIndex: 2100 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
