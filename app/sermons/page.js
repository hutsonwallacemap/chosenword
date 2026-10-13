'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, RotateCcw, NotebookPen, ShieldCheck, X, ArrowLeft, Download } from 'lucide-react';
import {
  listSermons, createSermon, restoreSermon, deleteSermonForever, purgeOldTrash,
  isStoragePersistent, requestPersistentStorage, sermonPlainText, formatSermonDate, SERMON_STATUSES, TRASH_DAYS,
} from '../lib/sermonStore';

const STATUS_STYLES = {
  idea: { background: 'var(--accent-purple-light)', color: 'var(--accent-purple)' },
  draft: { background: 'var(--accent-gold-light)', color: 'var(--accent-gold-text)' },
  preached: { background: 'rgba(22, 163, 74, 0.12)', color: 'var(--success)' },
};

export default function SermonsPage() {
  const router = useRouter();
  const [sermons, setSermons] = useState(null); // null while loading
  const [trashed, setTrashed] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState(null);
  const [error, setError] = useState('');
  const [isPersistent, setIsPersistent] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(true);

  const load = async () => {
    try {
      await purgeOldTrash();
      setSermons(await listSermons());
      setTrashed(await listSermons({ trashed: true }));
    } catch (e) {
      setError(e.message || 'Sermons could not be loaded on this device.');
      setSermons([]);
    }
  };

  useEffect(() => {
    load();
    isStoragePersistent().then(setIsPersistent);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
    // Chrome/Edge/Android offer an install prompt we can trigger from our own button
    const onBeforeInstall = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const handleNew = async () => {
    try {
      const sermon = await createSermon();
      router.push(`/sermons/edit?id=${sermon.id}`);
    } catch (e) {
      setError(e.message || 'A new sermon could not be created.');
    }
  };

  const handleKeepSafe = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    }
    setIsPersistent(await requestPersistentStorage());
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    (sermons || []).forEach(s => (s.tags || []).forEach(t => tags.add(t)));
    return [...tags].sort((a, b) => a.localeCompare(b));
  }, [sermons]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (sermons || []).filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (tagFilter && !(s.tags || []).includes(tagFilter)) return false;
      if (!q) return true;
      return sermonPlainText(s).toLowerCase().includes(q)
        || (s.series || '').toLowerCase().includes(q)
        || (s.tags || []).some(t => t.toLowerCase().includes(q));
    });
  }, [sermons, query, statusFilter, tagFilter]);

  const daysLeft = (deletedAt) =>
    Math.max(0, TRASH_DAYS - Math.floor((Date.now() - deletedAt) / (24 * 60 * 60 * 1000)));

  if (showTrash) {
    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setShowTrash(false)} aria-label="Back to sermons" className="icon-btn" style={{ boxShadow: 'none' }}>
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Trash</h1>
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Deleted sermons stay here for {TRASH_DAYS} days, then they're removed for good.
        </p>
        {trashed.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Trash is empty.</div>}
        {trashed.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700 }}>{s.title || 'Untitled sermon'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deleted · removed in {daysLeft(s.deletedAt)} days</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="sermon-btn" onClick={async () => { await restoreSermon(s.id); load(); }}>
                <RotateCcw size={15} aria-hidden="true" /> Restore
              </button>
              <button
                className="sermon-btn sermon-btn-danger"
                onClick={async () => {
                  if (!window.confirm(`Delete "${s.title || 'Untitled sermon'}" forever? This can't be undone.`)) return;
                  await deleteSermonForever(s.id);
                  load();
                }}
              >
                <Trash2 size={15} aria-hidden="true" /> Delete forever
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Sermons</h1>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Saved automatically on this device
          </p>
        </div>
        <button onClick={handleNew} className="sermon-btn sermon-btn-primary" style={{ minHeight: '44px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <Plus size={18} aria-hidden="true" /> New sermon
        </button>
      </div>

      {error && <div role="alert" className="card" style={{ color: 'var(--danger)' }}>{error}</div>}

      {/* Keep sermons safe: install the app and ask for persistent storage */}
      {sermons && sermons.length > 0 && (!isPersistent || !isStandalone) && (
        <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', borderLeft: '4px solid var(--accent-gold)', borderRadius: 0 }}>
          <ShieldCheck size={22} aria-hidden="true" style={{ color: 'var(--accent-gold-text)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <strong>Keep your sermons safe on this device</strong>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {installPrompt
                ? 'Install Chosen Word as an app so your phone never clears your sermons to free up space.'
                : 'Add Chosen Word to your home screen (browser menu → "Add to Home Screen") so your phone never clears your sermons. Backing up from Settings also protects them.'}
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="sermon-btn sermon-btn-primary" onClick={handleKeepSafe}>
                <Download size={15} aria-hidden="true" /> {installPrompt ? 'Install app' : 'Protect my sermons'}
              </button>
              <Link href="/settings#backup" className="sermon-btn">Back up now</Link>
            </div>
          </div>
        </div>
      )}

      {sermons && sermons.length > 0 && (
        <>
          <div style={{ position: 'relative' }}>
            <Search size={18} aria-hidden="true" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, notes, verses, tags"
              aria-label="Search sermons"
              className="sermon-input"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} role="group" aria-label="Filter by status">
            {[{ id: 'all', label: 'All' }, ...SERMON_STATUSES].map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                aria-pressed={statusFilter === s.id}
                className={`sermon-chip ${statusFilter === s.id ? 'active' : ''}`}
              >
                {s.label}
              </button>
            ))}
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                aria-pressed={tagFilter === tag}
                className={`sermon-chip ${tagFilter === tag ? 'active' : ''}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </>
      )}

      {sermons === null && <div className="card" style={{ color: 'var(--text-secondary)' }}>Loading sermons…</div>}

      {sermons && sermons.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <NotebookPen size={40} aria-hidden="true" style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Write your first sermon</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6 }}>
            Outline your points, drop in verses from any translation, and preach straight from your phone or tablet. Everything saves as you type.
          </p>
          <button onClick={handleNew} className="sermon-btn sermon-btn-primary" style={{ minHeight: '44px' }}>
            <Plus size={18} aria-hidden="true" /> New sermon
          </button>
        </div>
      )}

      {sermons && sermons.length > 0 && visible.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No sermons match your search.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {visible.map(s => {
          const status = SERMON_STATUSES.find(x => x.id === s.status) || SERMON_STATUSES[1];
          return (
            <Link key={s.id} href={`/sermons/edit?id=${s.id}`} className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{s.title || 'Untitled sermon'}</span>
                <span style={{ ...STATUS_STYLES[status.id], fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', whiteSpace: 'nowrap' }}>{status.label}</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {[s.mainPassage, formatSermonDate(s.date), s.place, s.series].filter(Boolean).join(' · ') || 'No details yet'}
              </span>
              {(s.tags || []).length > 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>{s.tags.map(t => `#${t}`).join('  ')}</span>
              )}
            </Link>
          );
        })}
      </div>

      {trashed.length > 0 && (
        <button onClick={() => setShowTrash(true)} className="sermon-btn" style={{ alignSelf: 'center', marginTop: '8px' }}>
          <Trash2 size={15} aria-hidden="true" /> Trash ({trashed.length})
        </button>
      )}
    </div>
  );
}
