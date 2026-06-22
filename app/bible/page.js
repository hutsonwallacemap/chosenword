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

const CHAPTER_COUNTS = {
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

export default function BibleReader() {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [primaryLang, setPrimaryLang] = useState('kjv');
  const [secondaryLang, setSecondaryLang] = useState('none');
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [savedVerses, setSavedVerses] = useState([]);
  const [bookmarkedChapters, setBookmarkedChapters] = useState([]);

  useEffect(() => {
    setSavedVerses(JSON.parse(localStorage.getItem('cw_saved_verses')) || []);
    setBookmarkedChapters(JSON.parse(localStorage.getItem('cw_bookmarks')) || []);
  }, []);

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      setError('');
      try {
        let fetchedData = [];

        // Fetch primary translation
        const res1 = await fetch(`https://api.biblesupersearch.com/api?bible=${primaryLang}&reference=${book}%20${chapter}`);
        if (!res1.ok) throw new Error('Network error');
        const data1 = await res1.json();
        
        let primaryVerses = [];
        if (data1.results && data1.results[0] && data1.results[0].verses) {
          const versesObj = data1.results[0].verses[primaryLang][chapter];
          for (let v in versesObj) {
            primaryVerses.push({ verseNum: parseInt(v), primaryText: versesObj[v].text.replace(/<[^>]*>?/gm, '') });
          }
        } else {
          throw new Error('Chapter not found');
        }

        // Fetch secondary translation if selected
        if (secondaryLang !== 'none') {
          const res2 = await fetch(`https://api.biblesupersearch.com/api?bible=${secondaryLang}&reference=${book}%20${chapter}`);
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2.results && data2.results[0] && data2.results[0].verses) {
              const versesObj = data2.results[0].verses[secondaryLang][chapter];
              // Merge secondary verses
              primaryVerses = primaryVerses.map(v => ({
                ...v,
                secondaryText: versesObj[v.verseNum] ? versesObj[v.verseNum].text.replace(/<[^>]*>?/gm, '') : ''
              }));
            }
          }
        }
        
        setVerses(primaryVerses);
      } catch (err) {
        setError('Failed to load chapter. Please check your internet connection.');
        setVerses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
  }, [book, chapter, primaryLang, secondaryLang]);

  // Handle Verse Highlighting
  const toggleHighlight = (verseObj, text, langLabel) => {
    const ref = `${book} ${chapter}:${verseObj.verseNum}`;
    let newSaved;
    if (savedVerses.some(v => v.ref === ref && v.text === text)) {
      newSaved = savedVerses.filter(v => !(v.ref === ref && v.text === text));
    } else {
      newSaved = [...savedVerses, { ref, text, lang: langLabel }];
    }
    setSavedVerses(newSaved);
    localStorage.setItem('cw_saved_verses', JSON.stringify(newSaved));
  };

  const isHighlighted = (verseNum, text) => {
    const ref = `${book} ${chapter}:${verseNum}`;
    return savedVerses.some(v => v.ref === ref && v.text === text);
  };

  // Handle Chapter Bookmarking
  const toggleBookmark = () => {
    const ref = `${book} ${chapter}`;
    let newBookmarks;
    if (bookmarkedChapters.some(b => b.ref === ref)) {
      newBookmarks = bookmarkedChapters.filter(b => b.ref !== ref);
    } else {
      newBookmarks = [...bookmarkedChapters, { ref, book, chapter }];
    }
    setBookmarkedChapters(newBookmarks);
    localStorage.setItem('cw_bookmarks', JSON.stringify(newBookmarks));
  };

  const isChapterBookmarked = () => {
    return bookmarkedChapters.some(b => b.ref === `${book} ${chapter}`);
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      
      {/* Controls Card */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Book & Chapter Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="custom-select"
            value={book} 
            onChange={(e) => { setBook(e.target.value); setChapter(1); }}
            style={{ flex: 2 }}
          >
            {ALL_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          
          <select 
            className="custom-select"
            value={chapter} 
            onChange={(e) => setChapter(e.target.value)}
            style={{ flex: 1 }}
          >
            {[...Array(CHAPTER_COUNTS[book] || 1)].map((_, i) => <option key={i+1} value={i+1}>Ch {i+1}</option>)}
          </select>
          
          {/* Bookmark Button */}
          <button 
            onClick={toggleBookmark}
            style={{ 
              backgroundColor: isChapterBookmarked() ? 'var(--accent-gold-light)' : 'var(--bg-secondary)',
              color: isChapterBookmarked() ? 'var(--accent-gold)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontVariationSettings: isChapterBookmarked() ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
          </button>
        </div>

        {/* Translation Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Primary</label>
            <select 
              className="custom-select"
              value={primaryLang} 
              onChange={(e) => setPrimaryLang(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="kjv">English: KJV</option>
              <option value="web">English: WEB</option>
              <option value="asv">English: ASV</option>
              <option value="net">English: NET</option>
              <option value="irv">Hindi (IRV)</option>
              <option value="tamil">Tamil</option>
              <option value="telugu">Telugu</option>
              <option value="bengali">Bengali</option>
            </select>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Secondary</label>
            <select 
              className="custom-select"
              value={secondaryLang} 
              onChange={(e) => setSecondaryLang(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="none">None</option>
              <option value="kjv">English: KJV</option>
              <option value="web">English: WEB</option>
              <option value="asv">English: ASV</option>
              <option value="net">English: NET</option>
              <option value="irv">Hindi (IRV)</option>
              <option value="tamil">Tamil</option>
              <option value="telugu">Telugu</option>
              <option value="bengali">Bengali</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="placeholder-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '3rem', color: 'var(--accent-gold)', animation: 'spin 2s linear infinite' }}>autorenew</span>
          Fetching verses...
        </div>
      )}
      
      {error && (
        <div className="card" style={{ textAlign: 'center', color: '#ef4444', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '3rem', marginBottom: '8px' }}>wifi_off</span>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="card" style={{ padding: '32px 24px', backgroundColor: 'var(--bg-primary)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '32px', color: 'var(--text-primary)' }}>
            {book} {chapter}
          </h2>
          
          {verses.map(v => (
            <div key={v.verseNum} style={{ marginBottom: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-10px', top: '4px', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 800 }}>
                {v.verseNum}
              </div>
              
              <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Primary Verse */}
                <p 
                  className={`verse-item ${isHighlighted(v.verseNum, v.primaryText) ? 'highlighted' : ''}`}
                  onClick={() => toggleHighlight(v, v.primaryText, primaryLang)}
                  style={{ fontSize: '1.2rem', margin: 0, cursor: 'pointer', lineHeight: 1.5 }}
                >
                  {v.primaryText}
                </p>

                {/* Secondary Verse (Dual Mode) */}
                {secondaryLang !== 'none' && v.secondaryText && (
                  <p 
                    className={`verse-item ${isHighlighted(v.verseNum, v.secondaryText) ? 'highlighted' : ''}`}
                    onClick={() => toggleHighlight(v, v.secondaryText, secondaryLang)}
                    style={{ 
                      fontSize: '1.1rem', 
                      margin: 0, 
                      cursor: 'pointer', 
                      color: isHighlighted(v.verseNum, v.secondaryText) ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      lineHeight: 1.5,
                      borderLeft: '2px solid var(--border-color)',
                      paddingLeft: '12px'
                    }}
                  >
                    {v.secondaryText}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
