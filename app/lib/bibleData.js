// Loading and reading the offline Bible translation files (public/*.json).
// Shared by the reader, Compare, and the sermon verse picker.
import { offlineTranslations } from '../data/translations';

// Helper: generate all possible name variants for a book
export const getBookNameVariants = (name) => {
  if (!name) return [];
  const variants = new Set([name]);
  // "1 Samuel" <-> "I Samuel", "2 Kings" <-> "II Kings", "3 John" <-> "III John"
  if (/^1\s+/.test(name)) variants.add(name.replace(/^1\s+/, 'I '));
  if (/^2\s+/.test(name)) variants.add(name.replace(/^2\s+/, 'II '));
  if (/^3\s+/.test(name)) variants.add(name.replace(/^3\s+/, 'III '));
  if (/^I\s+/.test(name) && !/^II/.test(name) && !/^III/.test(name)) variants.add(name.replace(/^I\s+/, '1 '));
  if (/^II\s+/.test(name) && !/^III/.test(name)) variants.add(name.replace(/^II\s+/, '2 '));
  if (/^III\s+/.test(name)) variants.add(name.replace(/^III\s+/, '3 '));

  if (name.includes('Revelation')) {
    variants.add('Revelation');
    variants.add('Revelation of John');
    variants.add('The Revelation of St. John');
    variants.add('Revelation of St. John');
    variants.add('The Revelation');
  }
  if (name.includes('Song of Solomon') || name.includes('Song of Songs')) {
    variants.add('Song of Solomon');
    variants.add('Song of Songs');
    variants.add('Canticles');
    variants.add('Song of Songs of Solomon');
  }
  if (name.includes('Psalm')) {
    variants.add('Psalms');
    variants.add('Psalm');
  }
  return Array.from(variants);
};

// Helper: find a book in a list by trying all name variants
export const findBookInData = (booksList, bookName) => {
  if (!booksList || !Array.isArray(booksList)) return null;
  const variants = getBookNameVariants(bookName);
  for (const variant of variants) {
    const found = booksList.find(b => b && b.name === variant);
    if (found) return found;
  }
  const lowerVariants = variants.map(v => v.toLowerCase());
  return booksList.find(b => b && b.name && lowerVariants.includes(b.name.toLowerCase())) || null;
};

const stripTags = (text) => (text || '').replace(/<[^>]*>?/gm, '');

// All verses of one chapter as [{ verseNum, text }], in any of the file formats.
// Throws if the book or chapter isn't in this translation.
export const getChapterVerses = (data, book, chapter) => {
  const chapterStr = chapter.toString();
  const variants = getBookNameVariants(book);

  // Flat verses array (e.g. kjv.json, net.json, bishops.json)
  if (data.verses && Array.isArray(data.verses)) {
    const chapterVerses = data.verses.filter(v =>
      variants.includes(v.book_name) && v.chapter.toString() === chapterStr
    );
    if (chapterVerses.length === 0) throw new Error('Chapter not found');
    return chapterVerses.map(v => ({ verseNum: parseInt(v.verse), text: stripTags(v.text) }));
  }

  // Books array (e.g. AKJV.json, BBE.json, ASV.json) or a root array of books
  const booksList = data.books && Array.isArray(data.books) ? data.books : Array.isArray(data) ? data : null;
  if (booksList) {
    const bookData = findBookInData(booksList, book);
    if (!bookData) throw new Error('Book not found');
    const chapterData = (bookData.chapters || []).find(c =>
      (c.chapter || c.name || '').toString() === chapterStr || c.chapter === parseInt(chapter)
    );
    if (!chapterData) throw new Error('Chapter not found');
    return (chapterData.verses || []).map(v => ({ verseNum: parseInt(v.verse), text: stripTags(v.text) }));
  }

  // Nested objects { book: { chapter: { verse: text } } } (e.g. hindi_offline.json, ta_offline.json)
  const keys = Object.keys(data);
  let chapterData = null;
  for (const variant of variants) {
    const key = data[variant] ? variant : keys.find(k => k.toLowerCase() === variant.toLowerCase());
    if (key && data[key] && data[key][chapterStr]) {
      chapterData = data[key][chapterStr];
      break;
    }
  }
  if (!chapterData) throw new Error('Chapter not found');
  return Object.keys(chapterData).map(v => ({ verseNum: parseInt(v), text: stripTags(chapterData[v]) }));
};

// Finds one verse's text in any of the translation file formats, or '' if it isn't there
export const findVerseText = (data, book, chapter, verseNum) => {
  try {
    const verse = getChapterVerses(data, book, chapter).find(v => v.verseNum === parseInt(verseNum));
    return verse ? verse.text : '';
  } catch (e) {
    return '';
  }
};

// In-memory cache for loaded translation JSONs
export const bibleDataCache = {};

export const fetchTranslationData = async (filename) => {
  if (bibleDataCache[filename]) return bibleDataCache[filename];

  // All translation files are lowercase (public/kjv.json, ...), so one request is enough
  let res;
  try {
    res = await fetch(`/${filename.toLowerCase()}.json`);
  } catch (e) {
    // No connection and this translation hasn't been saved on the device yet
    throw new Error("This translation isn't saved for offline reading yet. Connect to the internet and open it once to save it.");
  }
  if (!res.ok) {
    throw new Error(`Failed to load Bible translation (${filename})`);
  }

  const rawText = await res.text();
  const data = JSON.parse(rawText.replace(/^﻿/, ''));
  bibleDataCache[filename] = data;
  return data;
};

// Translation id (e.g. 'kjv_offline') -> its JSON filename
export const translationFilename = (translationId) =>
  offlineTranslations.find(t => t.id === translationId)?.filename || translationId.replace('_offline', '');

// Short label for a translation id, e.g. 'kjv_offline' -> 'KJV'
export const translationShortName = (translationId) => {
  const t = offlineTranslations.find(t => t.id === translationId);
  if (!t) return translationId.replace('_offline', '').toUpperCase();
  return t.name.replace(/^English:\s*/, '');
};
