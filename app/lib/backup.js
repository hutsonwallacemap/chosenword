// Backup, restore and erase for everything the user creates in Chosen Word.
// All data lives in this browser's localStorage, so a backup file is the only
// way to keep it safe or move it to another device.

const PLAN_IDS = ['30day', '6month', '1year'];
const LAST_BACKUP_KEY = 'cw_last_backup';
const REMINDER_KEY = 'cw_backup_reminder_dismissed';
// Display preferences survive "Erase all my data"
const PRESERVED_KEYS = ['cw_theme', 'cw_font_size'];

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (e) {
    return fallback;
  }
};

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Keeps only { key: "text" } entries so a damaged file can't store junk
const cleanNotes = (notes) =>
  isPlainObject(notes)
    ? Object.fromEntries(Object.entries(notes).filter(([, text]) => typeof text === 'string' && text.trim()))
    : {};

export const getDataSummary = () => {
  const notes =
    Object.keys(readJSON('cw_notes', {})).length +
    Object.keys(readJSON('cw_chapter_notes', {})).length +
    Object.keys(readJSON('cw_book_notes', {})).length;
  const lastBackup = parseInt(localStorage.getItem(LAST_BACKUP_KEY)) || null;
  return {
    highlights: readJSON('cw_saved_verses', []).length,
    bookmarks: readJSON('cw_bookmarks', []).length,
    notes,
    lastBackup,
  };
};

export const downloadBackup = () => {
  const readingPlans = {};
  PLAN_IDS.forEach(id => {
    const progress = readJSON(`cw_plan_${id}`, {});
    if (Object.keys(progress).length > 0) readingPlans[id] = progress;
  });

  const backup = {
    version: '2.0',
    app: 'Chosen Word Bible App',
    exportedAt: new Date().toISOString(),
    data: {
      savedVerses: readJSON('cw_saved_verses', []),
      bookmarks: readJSON('cw_bookmarks', []),
      notes: readJSON('cw_notes', {}),
      chapterNotes: readJSON('cw_chapter_notes', {}),
      bookNotes: readJSON('cw_book_notes', {}),
      readingPlans,
    },
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chosen-word-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Also pauses the "back up your notes" reminder on the Saved page
  localStorage.setItem(LAST_BACKUP_KEY, Date.now().toString());
  localStorage.setItem(REMINDER_KEY, Date.now().toString());
};

// Merges a backup file into what is already on this device (nothing is overwritten
// except notes for the same verse/chapter/book). Returns counts of what was restored.
export const restoreBackup = (fileText) => {
  let json;
  try {
    json = JSON.parse(fileText);
  } catch (e) {
    throw new Error("This file can't be read. Please choose a Chosen Word backup file.");
  }
  const data = isPlainObject(json?.data) ? json.data : json;
  if (!isPlainObject(data)) {
    throw new Error("This file isn't a Chosen Word backup.");
  }

  const counts = { highlights: 0, bookmarks: 0, notes: 0, plans: 0 };
  let recognised = false;

  if (Array.isArray(data.savedVerses)) {
    recognised = true;
    const incoming = data.savedVerses.filter(v => isPlainObject(v) && typeof v.ref === 'string' && typeof v.text === 'string');
    const map = new Map(readJSON('cw_saved_verses', []).map(v => [`${v.ref}::${v.text}`, v]));
    incoming.forEach(v => map.set(`${v.ref}::${v.text}`, v));
    localStorage.setItem('cw_saved_verses', JSON.stringify([...map.values()]));
    counts.highlights = incoming.length;
  }

  if (Array.isArray(data.bookmarks)) {
    recognised = true;
    const incoming = data.bookmarks.filter(b => isPlainObject(b) && typeof b.ref === 'string');
    const map = new Map(readJSON('cw_bookmarks', []).map(b => [b.ref, b]));
    incoming.forEach(b => map.set(b.ref, b));
    localStorage.setItem('cw_bookmarks', JSON.stringify([...map.values()]));
    counts.bookmarks = incoming.length;
  }

  [['notes', 'cw_notes'], ['chapterNotes', 'cw_chapter_notes'], ['bookNotes', 'cw_book_notes']].forEach(([field, key]) => {
    if (!isPlainObject(data[field])) return;
    recognised = true;
    const incoming = cleanNotes(data[field]);
    localStorage.setItem(key, JSON.stringify({ ...readJSON(key, {}), ...incoming }));
    counts.notes += Object.keys(incoming).length;
  });

  if (isPlainObject(data.readingPlans)) {
    recognised = true;
    PLAN_IDS.forEach(id => {
      const incoming = data.readingPlans[id];
      if (!isPlainObject(incoming)) return;
      const key = `cw_plan_${id}`;
      localStorage.setItem(key, JSON.stringify({ ...readJSON(key, {}), ...incoming }));
      counts.plans += 1;
    });
  }

  if (!recognised) {
    throw new Error("This file isn't a Chosen Word backup.");
  }
  return counts;
};

// Removes every highlight, note, bookmark, plan, quiz, streak and reading position.
export const eraseAllUserData = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('cw_') && !PRESERVED_KEYS.includes(key)) keys.push(key);
  }
  keys.forEach(key => localStorage.removeItem(key));
};

export const describeRestore = ({ highlights, bookmarks, notes, plans }) => {
  const parts = [];
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  if (highlights) parts.push(plural(highlights, 'highlight'));
  if (notes) parts.push(plural(notes, 'note'));
  if (bookmarks) parts.push(plural(bookmarks, 'bookmark'));
  if (plans) parts.push(plural(plans, 'reading plan'));
  return parts.length ? `Restored ${parts.join(', ')}.` : 'Backup restored. It was empty, so nothing new was added.';
};
