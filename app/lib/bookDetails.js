'use client';
import { useState, useEffect } from 'react';
import { bookIndex } from '../data/bookIndex';

// Per-book chapter teachings, key verses and notes are fetched on demand from
// public/book-details/<book>.json instead of shipping all 66 books in the page bundle.
// The service worker caches each file after its first load, so they work offline too.

const detailsCache = {};   // book -> details object
const inflight = {};       // book -> Promise

const slug = (book) => book.toLowerCase().replace(/\s+/g, '-');

export const loadBookDetails = (book) => {
  if (detailsCache[book]) return Promise.resolve(detailsCache[book]);
  if (!inflight[book]) {
    inflight[book] = fetch(`/book-details/${slug(book)}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`No details for ${book}`);
        return res.json();
      })
      .then(details => {
        detailsCache[book] = details;
        return details;
      })
      .finally(() => { delete inflight[book]; });
  }
  return inflight[book];
};

// Returns the book's full summary (index facts + details once loaded), or null for unknown books.
// While details load, the light facts (author, summary, keyThemes) are already available.
export function useBookSummary(book) {
  const [details, setDetails] = useState(() => (book ? detailsCache[book] || null : null));

  useEffect(() => {
    if (!book || !bookIndex[book]) { setDetails(null); return; }
    if (detailsCache[book]) { setDetails(detailsCache[book]); return; }
    let cancelled = false;
    setDetails(null);
    loadBookDetails(book)
      .then(d => { if (!cancelled) setDetails(d); })
      .catch(() => { if (!cancelled) setDetails({}); }); // offline and never cached: show the light facts only
    return () => { cancelled = true; };
  }, [book]);

  if (!book || !bookIndex[book]) return null;
  return { ...bookIndex[book], ...(details || {}), detailsLoaded: !!details };
}
