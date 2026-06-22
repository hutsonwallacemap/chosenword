'use client';
import { useState, useEffect } from 'react';

const ALL_BOOKS = [
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

export default function BibleReader() {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [translation, setTranslation] = useState('kjv');
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedVerses, setSavedVerses] = useState([]);

  useEffect(() => {
    // Load saved verses from local storage
    const saved = JSON.parse(localStorage.getItem('cw_saved_verses')) || [];
    setSavedVerses(saved);
  }, []);

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://api.biblesupersearch.com/api?bible=${translation}&reference=${book}%20${chapter}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        
        if (data.results && data.results[0] && data.results[0].verses) {
          const versesObj = data.results[0].verses[translation][chapter];
          let fetchedVerses = [];
          for (let v in versesObj) {
            fetchedVerses.push({ verse: parseInt(v), text: versesObj[v].text.replace(/<[^>]*>?/gm, '') });
          }
          setVerses(fetchedVerses);
        } else {
          throw new Error('Chapter not found');
        }
      } catch (err) {
        setError('Failed to load chapter. Please check your internet connection.');
        setVerses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
  }, [book, chapter, translation]);

  const toggleHighlight = (verseObj) => {
    const ref = `${book} ${chapter}:${verseObj.verse}`;
    let newSaved;
    if (savedVerses.some(v => v.ref === ref)) {
      newSaved = savedVerses.filter(v => v.ref !== ref);
    } else {
      newSaved = [...savedVerses, { ref, text: verseObj.text }];
    }
    setSavedVerses(newSaved);
    localStorage.setItem('cw_saved_verses', JSON.stringify(newSaved));
  };

  const isHighlighted = (verseNum) => {
    const ref = `${book} ${chapter}:${verseNum}`;
    return savedVerses.some(v => v.ref === ref);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select 
          value={book} 
          onChange={(e) => { setBook(e.target.value); setChapter(1); }}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', flex: 1 }}
        >
          {ALL_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        
        <select 
          value={chapter} 
          onChange={(e) => setChapter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', width: '80px' }}
        >
          {[...Array(150)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>

        <select 
          value={translation} 
          onChange={(e) => setTranslation(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', width: '80px' }}
        >
          <option value="kjv">KJV</option>
          <option value="web">WEB</option>
          <option value="asv">ASV</option>
        </select>
      </div>

      {loading && <div className="placeholder-text">Loading chapter...</div>}
      {error && <div className="placeholder-text">{error}</div>}
      
      {!loading && !error && (
        <div style={{ paddingBottom: '40px' }}>
          {verses.map(v => (
            <div key={v.verse} style={{ marginBottom: '12px', fontSize: '1.1rem', display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 'bold', marginTop: '4px' }}>{v.verse}</span>
              <span 
                onClick={() => toggleHighlight(v)}
                style={{ 
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  backgroundColor: isHighlighted(v.verse) ? 'var(--accent-gold-light)' : 'transparent',
                  color: isHighlighted(v.verse) ? 'var(--accent-gold)' : 'inherit',
                  transition: 'background-color 0.2s'
                }}
              >
                {v.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
