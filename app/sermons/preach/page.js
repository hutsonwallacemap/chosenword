'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Minus, Plus, List, Square, Printer } from 'lucide-react';
import { getSermon, saveSermon, formatSermonDate } from '../../lib/sermonStore';
import { renderRedLetter } from '../../lib/verseText';

// Splits the outline into slides: everything before the first point is the introduction,
// then each point starts a new slide.
const toSections = (sermon) => {
  const sections = [];
  let current = { title: 'Introduction', blocks: [], isIntro: true };
  for (const block of sermon.blocks || []) {
    if (block.type === 'point') {
      if (current.blocks.length > 0 || !current.isIntro) sections.push(current);
      current = { title: block.text || 'Untitled point', blocks: [] };
    } else {
      current.blocks.push(block);
    }
  }
  if (current.blocks.length > 0 || !current.isIntro) sections.push(current);
  return sections;
};

const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

const FONT_SIZES = [18, 21, 24, 28, 33, 38];

function BlockView({ block }) {
  if (block.type === 'text') {
    return <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{block.text}</p>;
  }
  if (block.type === 'verse') {
    return (
      <blockquote className="preach-verse">
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          {(block.verses || []).map(v => (
            <span key={v.n}><sup style={{ fontSize: '0.55em', color: 'var(--text-secondary)' }}>{v.n}</sup> {renderRedLetter(v.text)} </span>
          ))}
        </p>
        <footer style={{ marginTop: '6px', fontSize: '0.7em', fontWeight: 700, color: 'var(--accent-gold-text)' }}>
          {block.ref} · {block.translationLabel}
        </footer>
      </blockquote>
    );
  }
  return null;
}

export default function PreachMode() {
  const router = useRouter();
  const [sermon, setSermon] = useState(null);
  const [missing, setMissing] = useState(false);
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [fontStep, setFontStep] = useState(2);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const startRef = useRef(null);
  const wakeLockRef = useRef(null);
  const touchRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const print = params.get('print') === '1';
    setIsPrint(print);
    try {
      const saved = parseInt(localStorage.getItem('cw_preach_font'));
      if (saved >= 0 && saved < FONT_SIZES.length) setFontStep(saved);
    } catch (e) {}
    getSermon(params.get('id')).then(found => {
      if (!found) { setMissing(true); return; }
      setSermon(found);
      if (print) setTimeout(() => window.print(), 400);
    }).catch(() => setMissing(true));
  }, []);

  const sections = useMemo(() => (sermon ? toSections(sermon) : []), [sermon]);

  // ---------- Timer ----------
  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed * 1000;
    const id = setInterval(() => setElapsed((Date.now() - startRef.current) / 1000), 500);
    return () => clearInterval(id);
  }, [running]);

  // ---------- Keep the screen on while preaching ----------
  useEffect(() => {
    if (isPrint || !sermon) return;
    const request = async () => {
      try {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setWakeLockActive(true);
          wakeLockRef.current.addEventListener('release', () => setWakeLockActive(false));
        }
      } catch (e) {
        setWakeLockActive(false);
      }
    };
    request();
    // The lock is dropped when the app is hidden; take it again when it comes back
    const onVisible = () => { if (document.visibilityState === 'visible') request(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      wakeLockRef.current?.release().catch(() => {});
    };
  }, [isPrint, sermon]);

  // ---------- Navigation ----------
  const go = (delta) => setIndex(i => Math.min(Math.max(i + delta, 0), Math.max(sections.length - 1, 0)));

  const exit = () => {
    if (sermon) router.push(`/sermons/edit?id=${sermon.id}`);
    else router.push('/sermons');
  };

  useEffect(() => {
    if (isPrint) return;
    const onKey = (e) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
      else if (e.key === 'Escape') exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sections.length, isPrint, sermon]);

  const changeFont = (delta) => {
    setFontStep(prev => {
      const next = Math.min(Math.max(prev + delta, 0), FONT_SIZES.length - 1);
      try { localStorage.setItem('cw_preach_font', String(next)); } catch (e) {}
      return next;
    });
  };

  const markPreached = async () => {
    if (!sermon || sermon.status === 'preached') return;
    const saved = await saveSermon({ ...sermon, status: 'preached' });
    setSermon(saved);
  };

  if (missing) {
    return (
      <div className="preach-screen" style={{ alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <p>This sermon isn't on this device.</p>
        <button className="sermon-btn" onClick={() => router.push('/sermons')}>Back to sermons</button>
      </div>
    );
  }
  if (!sermon) return <div className="preach-screen" />;

  // ---------- Print / PDF view ----------
  if (isPrint) {
    let n = 0;
    return (
      <div className="print-sheet">
        <div className="no-print" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button className="sermon-btn" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print or save as PDF</button>
          <button className="sermon-btn" onClick={exit}><X size={16} aria-hidden="true" /> Close</button>
        </div>
        <h1 style={{ margin: '0 0 4px' }}>{sermon.title || 'Untitled sermon'}</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)' }}>
          {[sermon.mainPassage, formatSermonDate(sermon.date), sermon.place, sermon.series].filter(Boolean).join(' · ')}
        </p>
        {sermon.blocks.map(block => {
          if (block.type === 'point') { n++; return <h2 key={block.id} style={{ marginTop: '22px' }}>{n}. {block.text}</h2>; }
          return <div key={block.id} style={{ marginBottom: '10px' }}><BlockView block={block} /></div>;
        })}
      </div>
    );
  }

  // ---------- Preach view ----------
  const target = (sermon.targetMinutes || 0) * 60;
  const overTime = target > 0 && elapsed > target;
  const nearEnd = target > 0 && !overTime && elapsed > target - 120;
  const section = sections[index];

  return (
    <div
      className="preach-screen"
      style={{ fontSize: `${FONT_SIZES[fontStep]}px` }}
      onTouchStart={(e) => { touchRef.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (showAll || touchRef.current === null) return;
        const dx = e.changedTouches[0].clientX - touchRef.current;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        touchRef.current = null;
      }}
    >
      {/* Top bar */}
      <div className="preach-bar" style={{ fontSize: '15px' }}>
        <button onClick={exit} aria-label="Exit preach mode" className="icon-btn" style={{ boxShadow: 'none' }}><X size={20} aria-hidden="true" /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            aria-label={`Time ${formatTime(elapsed)}${target ? ` of ${formatTime(target)}` : ''}`}
            style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '14px', marginRight: '2px', color: overTime ? 'var(--danger)' : nearEnd ? 'var(--accent-gold-text)' : 'var(--text-primary)' }}
          >
            {formatTime(elapsed)}{target ? <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}> / {formatTime(target)}</span> : null}
          </span>
          <button onClick={() => setRunning(!running)} aria-label={running ? 'Pause timer' : 'Start timer'} className="icon-btn" style={{ boxShadow: 'none' }}>
            {running ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <button onClick={() => { setRunning(false); setElapsed(0); }} aria-label="Reset timer" className="icon-btn" style={{ boxShadow: 'none' }}>
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={() => changeFont(-1)} aria-label="Smaller text" className="icon-btn" style={{ boxShadow: 'none' }}><Minus size={16} aria-hidden="true" /></button>
          <button onClick={() => changeFont(1)} aria-label="Larger text" className="icon-btn" style={{ boxShadow: 'none' }}><Plus size={16} aria-hidden="true" /></button>
          <button onClick={() => setShowAll(!showAll)} aria-label={showAll ? 'Show one point at a time' : 'Show whole sermon'} aria-pressed={showAll} className="icon-btn" style={{ boxShadow: 'none' }}>
            {showAll ? <Square size={16} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {sections.length === 0 && (
        <div className="preach-content"><p style={{ color: 'var(--text-secondary)' }}>This sermon is empty. Add points and notes in the editor first.</p></div>
      )}

      {/* Content */}
      {sections.length > 0 && (
        <div className="preach-content" aria-live="polite">
          {showAll ? (
            sections.map((s, i) => (
              <section key={i} style={{ marginBottom: '1.6em' }}>
                <h2 className="preach-heading">{s.title}</h2>
                {s.blocks.map(b => <div key={b.id} style={{ marginBottom: '0.8em' }}><BlockView block={b} /></div>)}
              </section>
            ))
          ) : (
            <section>
              {index === 0 && <p style={{ margin: '0 0 0.3em', fontSize: '0.65em', color: 'var(--text-secondary)', fontWeight: 600 }}>{sermon.title}</p>}
              <h2 className="preach-heading">{section.title}</h2>
              {section.blocks.map(b => <div key={b.id} style={{ marginBottom: '0.8em' }}><BlockView block={b} /></div>)}
              {index === sections.length - 1 && sermon.status !== 'preached' && (
                <button onClick={markPreached} className="sermon-btn" style={{ marginTop: '1em', fontSize: '15px' }}>Mark as preached</button>
              )}
            </section>
          )}
        </div>
      )}

      {/* Bottom bar */}
      {!showAll && sections.length > 0 && (
        <div className="preach-bar" style={{ fontSize: '15px' }}>
          <button onClick={() => go(-1)} disabled={index === 0} aria-label="Previous point" className="preach-nav"><ChevronLeft size={26} aria-hidden="true" /></button>
          <span style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            {index + 1} of {sections.length}
            {!wakeLockActive && <span style={{ display: 'block', fontSize: '12px' }}>Screen may dim</span>}
          </span>
          <button onClick={() => go(1)} disabled={index >= sections.length - 1} aria-label="Next point" className="preach-nav"><ChevronRight size={26} aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}
