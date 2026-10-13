// Canonical book list shared by the reader, search and home page.

export const ALL_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", 
  "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", 
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", 
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

export const CHAPTER_COUNTS = {
  "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34,
  "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10,
  "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150, "Proverbs": 31,
  "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66, "Jeremiah": 52, "Lamentations": 5,
  "Ezekiel": 48, "Daniel": 12, "Hosea": 14, "Joel": 3, "Amos": 9,
  "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3,
  "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4, "Matthew": 28,
  "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16,
  "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6, "Philippians": 4,
  "Colossians": 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4,
  "Titus": 3, "Philemon": 1, "Hebrews": 13, "James": 5, "1 Peter": 5,
  "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22
};

// Maps the book names used by the various translation files
// ("I Samuel", "Revelation of John", "Song of Songs", ...) to ALL_BOOKS names.
export const normalizeBookName = (name) => {
  if (!name) return null;
  let n = name.toString().trim()
    .replace(/^III\s+/i, '3 ')
    .replace(/^II\s+/i, '2 ')
    .replace(/^I\s+/i, '1 ');
  if (/^(the\s+)?revelation/i.test(n)) n = 'Revelation';
  else if (/^(song of songs|song of solomon|canticles)/i.test(n)) n = 'Song of Solomon';
  else if (/^psalm/i.test(n)) n = 'Psalms';
  const lower = n.toLowerCase();
  return ALL_BOOKS.find(b => b.toLowerCase() === lower) || null;
};

// Short forms that a plain prefix match would get wrong or miss
const BOOK_ABBREVIATIONS = {
  gn: 'Genesis', ex: 'Exodus', lv: 'Leviticus', nm: 'Numbers', dt: 'Deuteronomy',
  jdg: 'Judges', jdgs: 'Judges', rth: 'Ruth',
  '1kgs': '1 Kings', '2kgs': '2 Kings', '1sm': '1 Samuel', '2sm': '2 Samuel',
  ps: 'Psalms', psa: 'Psalms', psalm: 'Psalms', pss: 'Psalms', prv: 'Proverbs',
  sos: 'Song of Solomon', sng: 'Song of Solomon', songofsongs: 'Song of Solomon', canticles: 'Song of Solomon',
  mt: 'Matthew', mk: 'Mark', mrk: 'Mark', lk: 'Luke', jn: 'John', jhn: 'John',
  '1jn': '1 John', '2jn': '2 John', '3jn': '3 John',
  jas: 'James', phm: 'Philemon', philem: 'Philemon', php: 'Philippians',
};

// Book ids with spaces removed, in Bible order: "1corinthians", "songofsolomon", ...
const BOOK_KEYS = ALL_BOOKS.map(b => ({ book: b, key: b.toLowerCase().replace(/\s+/g, '') }));

// Turns "Jn 3:16", "1 Cor 13:4-7", "I John 1", "Psalm 23" into
// { book, chapter, verseStart, verseEnd } (verses null = whole chapter), or null if it can't.
export const parseReference = (input) => {
  if (!input) return null;
  const text = input.trim().toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/^(iii|3rd|third)\s+/, '3 ')
    .replace(/^(ii|2nd|second)\s+/, '2 ')
    .replace(/^(i|1st|first)\s+/, '1 ');
  const match = text.match(/^([1-3]?\s*[a-z][a-z.\s]*?)\s*(\d+)(?:\s*[:.]\s*(\d+)(?:\s*-\s*(\d+))?)?\s*$/);
  if (!match) return null;

  const token = match[1].replace(/[.\s]/g, '');
  const book = BOOK_ABBREVIATIONS[token]
    || BOOK_KEYS.find(b => b.key === token)?.book
    || (token.replace(/^\d/, '').length >= 2 ? BOOK_KEYS.find(b => b.key.startsWith(token))?.book : null);
  if (!book) return null;

  const chapter = parseInt(match[2]);
  if (chapter < 1 || chapter > (CHAPTER_COUNTS[book] || 1)) return null;

  const verseStart = match[3] ? parseInt(match[3]) : null;
  let verseEnd = match[4] ? parseInt(match[4]) : verseStart;
  if (verseStart !== null && verseEnd < verseStart) verseEnd = verseStart;
  return { book, chapter, verseStart, verseEnd };
};

export const formatReference = ({ book, chapter, verseStart, verseEnd }) => {
  if (!verseStart) return `${book} ${chapter}`;
  return verseEnd && verseEnd !== verseStart
    ? `${book} ${chapter}:${verseStart}-${verseEnd}`
    : `${book} ${chapter}:${verseStart}`;
};
