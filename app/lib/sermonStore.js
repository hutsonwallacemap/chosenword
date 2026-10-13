// Sermons live in IndexedDB on this device: far more room than localStorage (which is
// ~5 MB and shared with highlights/notes) and it handles large texts well.
//
// Sermon shape:
// { id, title, date: 'YYYY-MM-DD', place, mainPassage, series, tags: [], status: 'idea'|'draft'|'preached',
//   targetMinutes, blocks: [Block], createdAt, updatedAt, deletedAt: number|null }
// Block: { id, type: 'point', text } | { id, type: 'text', text }
//      | { id, type: 'verse', ref, translation, verses: [{ n, text }] }

const DB_NAME = 'chosen-word';
const DB_VERSION = 1;
const SERMONS = 'sermons';
const VERSIONS = 'sermonVersions';

export const TRASH_DAYS = 30;
const MAX_VERSIONS_PER_SERMON = 30;
const VERSION_INTERVAL_MS = 10 * 60 * 1000; // at most one automatic snapshot every 10 minutes

export const SERMON_STATUSES = [
  { id: 'idea', label: 'Idea' },
  { id: 'draft', label: 'Draft' },
  { id: 'preached', label: 'Preached' },
];

let dbPromise = null;

const openDb = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('This browser cannot store sermons (IndexedDB is unavailable).'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SERMONS)) {
        db.createObjectStore(SERMONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(VERSIONS)) {
        const versions = db.createObjectStore(VERSIONS, { keyPath: 'id' });
        versions.createIndex('sermonId', 'sermonId');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });
  return dbPromise;
};

// Runs one transaction and resolves with the value of the last request when it commits
const run = async (storeNames, mode, work) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeNames, mode);
    let result;
    const stores = Array.isArray(storeNames) ? storeNames.map(n => tx.objectStore(n)) : [tx.objectStore(storeNames)];
    const track = (request) => {
      request.onsuccess = () => { result = request.result; };
      return request;
    };
    work(...stores, track);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const createSermon = async (overrides = {}) => {
  const now = Date.now();
  const sermon = {
    id: newId(),
    title: '',
    date: today(),
    place: '',
    mainPassage: '',
    series: '',
    tags: [],
    status: 'draft',
    targetMinutes: 30,
    blocks: [{ id: newId(), type: 'point', text: '' }],
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
  await run(SERMONS, 'readwrite', (store, track) => track(store.put(sermon)));
  requestPersistentStorage();
  return sermon;
};

export const getSermon = (id) => run(SERMONS, 'readonly', (store, track) => track(store.get(id)));

export const listSermons = async ({ trashed = false } = {}) => {
  const all = (await run(SERMONS, 'readonly', (store, track) => track(store.getAll()))) || [];
  return all
    .filter(s => (trashed ? !!s.deletedAt : !s.deletedAt))
    .sort((a, b) => (trashed ? b.deletedAt - a.deletedAt : b.updatedAt - a.updatedAt));
};

export const saveSermon = async (sermon) => {
  const saved = { ...sermon, updatedAt: Date.now() };
  await run(SERMONS, 'readwrite', (store, track) => track(store.put(saved)));
  return saved;
};

// Move to trash (kept for TRASH_DAYS days), restore, or delete for good
export const trashSermon = async (id) => {
  const sermon = await getSermon(id);
  if (sermon) await run(SERMONS, 'readwrite', (store, track) => track(store.put({ ...sermon, deletedAt: Date.now() })));
};

export const restoreSermon = async (id) => {
  const sermon = await getSermon(id);
  if (sermon) await run(SERMONS, 'readwrite', (store, track) => track(store.put({ ...sermon, deletedAt: null, updatedAt: Date.now() })));
};

export const deleteSermonForever = async (id) => {
  const versions = await listVersions(id);
  await run([SERMONS, VERSIONS], 'readwrite', (sermons, versionStore, track) => {
    track(sermons.delete(id));
    versions.forEach(v => versionStore.delete(v.id));
  });
};

export const purgeOldTrash = async () => {
  const cutoff = Date.now() - TRASH_DAYS * 24 * 60 * 60 * 1000;
  const old = (await listSermons({ trashed: true })).filter(s => s.deletedAt < cutoff);
  for (const sermon of old) await deleteSermonForever(sermon.id);
  return old.length;
};

// ---------- Version history ----------

export const listVersions = async (sermonId) => {
  const versions = (await run(VERSIONS, 'readonly', (store, track) =>
    track(store.index('sermonId').getAll(sermonId)))) || [];
  return versions.sort((a, b) => b.savedAt - a.savedAt);
};

// Stores a snapshot unless one was taken in the last 10 minutes (pass force to skip that check)
export const snapshotVersion = async (sermon, { force = false } = {}) => {
  const versions = await listVersions(sermon.id);
  if (!force && versions[0] && Date.now() - versions[0].savedAt < VERSION_INTERVAL_MS) return false;
  // Don't store a snapshot identical to the latest one
  if (versions[0] && JSON.stringify(versions[0].sermon.blocks) === JSON.stringify(sermon.blocks)
    && versions[0].sermon.title === sermon.title) return false;

  const extra = versions.slice(MAX_VERSIONS_PER_SERMON - 1);
  await run(VERSIONS, 'readwrite', (store, track) => {
    track(store.put({ id: newId(), sermonId: sermon.id, savedAt: Date.now(), sermon }));
    extra.forEach(v => store.delete(v.id));
  });
  return true;
};

// ---------- Backup / restore / erase ----------

export const getAllSermonsForBackup = async () =>
  (await run(SERMONS, 'readonly', (store, track) => track(store.getAll()))) || [];

// Adds sermons from a backup. A sermon already on this device is replaced only if the
// backup copy was edited more recently. Returns how many were added or updated.
export const importSermons = async (incoming) => {
  const valid = (incoming || []).filter(s =>
    s && typeof s.id === 'string' && Array.isArray(s.blocks) && typeof s.updatedAt === 'number');
  let changed = 0;
  for (const sermon of valid) {
    const existing = await getSermon(sermon.id);
    if (!existing || existing.updatedAt < sermon.updatedAt) {
      await run(SERMONS, 'readwrite', (store, track) => track(store.put({
        tags: [], status: 'draft', deletedAt: null, ...sermon,
      })));
      changed++;
    }
  }
  return changed;
};

export const countSermons = async () => (await listSermons()).length;

export const clearAllSermons = () =>
  run([SERMONS, VERSIONS], 'readwrite', (sermons, versions, track) => {
    track(sermons.clear());
    versions.clear();
  });

// ---------- Keeping data safe ----------

// Asks the browser not to clear this site's storage when the device runs low on space.
// Installed apps (Add to Home Screen) are usually granted this automatically.
export const requestPersistentStorage = async () => {
  try {
    if (navigator.storage && navigator.storage.persist) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch (e) {}
  return false;
};

export const isStoragePersistent = async () => {
  try {
    return !!(navigator.storage && navigator.storage.persisted && await navigator.storage.persisted());
  } catch (e) {
    return false;
  }
};

// ---------- Text helpers (search, export, share) ----------

// "2026-10-19" -> "19 Oct 2026" in the reader's own locale
export const formatSermonDate = (iso) => {
  const d = iso ? new Date(`${iso}T00:00:00`) : null;
  return d && !isNaN(d) ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : (iso || '');
};

export const sermonPlainText = (sermon) => {
  const lines = [sermon.title || 'Untitled sermon'];
  const meta = [sermon.mainPassage, formatSermonDate(sermon.date), sermon.place].filter(Boolean).join(' · ');
  if (meta) lines.push(meta);
  lines.push('');
  for (const block of sermon.blocks || []) {
    if (block.type === 'point') lines.push('', (block.text || '').toUpperCase());
    else if (block.type === 'text') lines.push(block.text || '');
    else if (block.type === 'verse') {
      lines.push(`${block.ref} (${block.translationLabel || ''})`.replace(' ()', ''));
      (block.verses || []).forEach(v => lines.push(`${v.n} ${v.text}`));
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
};
