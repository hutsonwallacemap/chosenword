'use client';
import { useState, useEffect } from 'react';
import { offlineTranslations, getTtsLanguage } from '../data/translations';

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
  const [offlineData, setOfflineData] = useState({});
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [compareModal, setCompareModal] = useState({ isOpen: false, loading: false, data: [] });
  const [verseNotes, setVerseNotes] = useState({});
  const [noteModal, setNoteModal] = useState({ isOpen: false, verseRef: '', text: '' });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setSavedVerses(JSON.parse(localStorage.getItem('cw_saved_verses')) || []);
    setBookmarkedChapters(JSON.parse(localStorage.getItem('cw_bookmarks')) || []);
    setVerseNotes(JSON.parse(localStorage.getItem('cw_notes')) || {});
  }, []);

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      setError('');
      try {
        let primaryVerses = [];
        
        // Helper to get verses from either API or offline JSON
        const getVerses = async (lang) => {
          if (lang.endsWith('_offline')) {
            let baseFilename = lang.replace('_offline', '');
            const configLang = offlineTranslations.find(t => t.id === lang);
            if (configLang) {
              baseFilename = configLang.filename;
            }
            
            let data = offlineData[lang];
            if (!data) {
              const res = await fetch(`/${baseFilename}.json`);
              if (!res.ok) throw new Error('Failed to load offline Bible');
              data = await res.json();
              setOfflineData(prev => ({ ...prev, [lang]: data }));
            }

            // Handle new JSON format (Array of books)
            if (data.verses && Array.isArray(data.verses)) {
              const chapterVerses = data.verses.filter(v => v.book_name === book && v.chapter.toString() === chapter.toString());
              if (chapterVerses.length === 0) throw new Error('Chapter not found in offline data');
              return chapterVerses.map(v => ({
                verseNum: parseInt(v.verse),
                text: v.text.replace(/<[^>]*>?/gm, '')
              }));
            }
            else if (data.books && Array.isArray(data.books)) {
              const bookData = data.books.find(b => b.name === book);
              if (!bookData) throw new Error('Book not found in offline data');
              const chapterData = bookData.chapters.find(c => c.chapter.toString() === chapter.toString());
              if (!chapterData) throw new Error('Chapter not found in offline data');
              
              return chapterData.verses.map(v => ({ 
                verseNum: parseInt(v.verse), 
                text: v.text.replace(/<[^>]*>?/gm, '') 
              }));
            } 
            // Handle original JSON format (Nested objects)
            else {
              const chapterData = data[book]?.[chapter];
              if (!chapterData) throw new Error('Chapter not found in offline data');
              
              let fetched = [];
              for (let v in chapterData) {
                fetched.push({ verseNum: parseInt(v), text: chapterData[v] });
              }
              return fetched;
            }
          } else {
            const res = await fetch(`https://api.biblesupersearch.com/api?bible=${lang}&reference=${book}%20${chapter}`);
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            if (data.results && data.results[0] && data.results[0].verses) {
              const versesObj = data.results[0].verses[lang][chapter];
              let fetched = [];
              for (let v in versesObj) {
                fetched.push({ verseNum: parseInt(v), text: versesObj[v].text.replace(/<[^>]*>?/gm, '') });
              }
              return fetched;
            }
            throw new Error('Chapter not found');
          }
        };

        // Fetch primary translation
        const primaryData = await getVerses(primaryLang);
        primaryVerses = primaryData.map(v => ({ verseNum: v.verseNum, primaryText: v.text }));

        // Fetch secondary translation if selected
        if (secondaryLang !== 'none') {
          try {
            const secondaryData = await getVerses(secondaryLang);
            const secMap = {};
            secondaryData.forEach(v => secMap[v.verseNum] = v.text);
            
            primaryVerses = primaryVerses.map(v => ({
              ...v,
              secondaryText: secMap[v.verseNum] || ''
            }));
          } catch (e) {
            console.error("Secondary fetch failed", e);
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
  }, [book, chapter, primaryLang, secondaryLang, offlineData]);

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

  // Action Menu Handlers
  const handleCopy = async () => {
    if (!selectedVerse) return;
    try {
      await navigator.clipboard.writeText(`${book} ${chapter}:${selectedVerse.verseObj.verseNum} - ${selectedVerse.text}`);
      setSelectedVerse(null);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleShare = async () => {
    if (!selectedVerse) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Chosen Word - ${book} ${chapter}:${selectedVerse.verseObj.verseNum}`,
          text: `${selectedVerse.text} (${book} ${chapter}:${selectedVerse.verseObj.verseNum})`,
          url: window.location.href
        });
      }
      setSelectedVerse(null);
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  const handleSaveNote = () => {
    const newNotes = { ...verseNotes, [noteModal.verseRef]: noteModal.text };
    if (!noteModal.text.trim()) {
      delete newNotes[noteModal.verseRef];
    }
    setVerseNotes(newNotes);
    localStorage.setItem('cw_notes', JSON.stringify(newNotes));
    setNoteModal({ isOpen: false, verseRef: '', text: '' });
    setSelectedVerse(null);
  };

  const handleCompare = async () => {
    if (!selectedVerse) return;
    setCompareModal({ isOpen: true, loading: true, data: [] });
    
    const results = [];
    const targetVerseNum = selectedVerse.verseObj.verseNum.toString();

    for (const langObj of offlineTranslations) {
      try {
        const res = await fetch(`/${langObj.filename}.json`);
        if (!res.ok) continue;
        const data = await res.json();
        
        let text = '';
        if (data.verses && Array.isArray(data.verses)) {
          const verseData = data.verses.find(v => v.book_name === book && v.chapter.toString() === chapter.toString() && v.verse.toString() === targetVerseNum);
          if (verseData) text = verseData.text;
        } else if (Array.isArray(data)) {
          const bookData = data.find(b => b.name === book);
          if (bookData) {
            const chapterData = bookData.chapters.find(c => c.chapter.toString() === chapter.toString());
            if (chapterData) {
              const verseData = chapterData.verses.find(v => v.verse.toString() === targetVerseNum);
              if (verseData) text = verseData.text;
            }
          }
        } else {
          // Object-based schema (like Hindi/Tamil offline)
          const c = data[book]?.[chapter];
          if (c && c[targetVerseNum]) {
            text = c[targetVerseNum].replace(/<[^>]*>?/gm, '');
          }
        }
        
        if (text) {
          results.push({ name: langObj.name, text });
        }
      } catch (e) {
        console.error(`Error loading compare for ${langObj.name}`, e);
      }
    }
    
    setCompareModal({ isOpen: true, loading: false, data: results });
    setSelectedVerse(null);
  };

  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("Your browser does not support text-to-speech audio.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!verses.length) return;

    const textToRead = verses.map(v => `${v.verseNum}. ${v.primaryText}`).join('. ');
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    let targetLang = getTtsLanguage(primaryLang);
    utterance.lang = targetLang;

    // Try to explicitly set the voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes(targetLang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.85; // Slightly slower for scripture reading

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
      alert("Audio playback failed. Your device might not have this language voice installed.");
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
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
          
          {/* Audio Play Button */}
          <button 
            onClick={handlePlayAudio}
            style={{ 
              backgroundColor: isPlaying ? 'var(--accent-blue)' : 'var(--bg-secondary)',
              color: isPlaying ? 'white' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: isPlaying ? 'var(--accent-blue)' : 'var(--border-color)',
              transition: 'all 0.2s ease'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontVariationSettings: isPlaying ? "'FILL' 1" : "'FILL' 0" }}>
              {isPlaying ? 'stop_circle' : 'volume_up'}
            </span>
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
              <optgroup label="Offline">
                {offlineTranslations.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (OFFLINE)</option>
                ))}
              </optgroup>
              <optgroup label="Online">
                <option value="irv">Hindi (IRV - Online)</option>
                <option value="ta_irv">Tamil (Online)</option>
                <option value="te_irv">Telugu</option>
                <option value="bn_irv">Bengali</option>
              </optgroup>
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
              <optgroup label="Offline">
                {offlineTranslations.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (OFFLINE)</option>
                ))}
              </optgroup>
              <optgroup label="Online">
                <option value="irv">Hindi (IRV - Online)</option>
                <option value="ta_irv">Tamil (Online)</option>
                <option value="te_irv">Telugu</option>
                <option value="bn_irv">Bengali</option>
              </optgroup>
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
                  className={`verse-item ${isHighlighted(v.verseNum, v.primaryText) ? 'highlighted' : ''} ${selectedVerse?.text === v.primaryText ? 'selected-verse' : ''}`}
                  onClick={() => setSelectedVerse({ verseObj: v, text: v.primaryText, langLabel: primaryLang })}
                  style={{ fontSize: '1.2rem', margin: 0, cursor: 'pointer', lineHeight: 1.5, display: 'inline' }}
                >
                  {v.primaryText}
                </p>
                {verseNotes[`${book} ${chapter}:${v.verseNum}`] && (
                  <span className="material-symbols-rounded" style={{ fontSize: '1rem', color: 'var(--accent-blue)', verticalAlign: 'middle', marginLeft: '8px' }}>sticky_note_2</span>
                )}

                {/* Secondary Verse (Dual Mode) */}
                {secondaryLang !== 'none' && v.secondaryText && (
                  <p 
                    className={`verse-item ${isHighlighted(v.verseNum, v.secondaryText) ? 'highlighted' : ''} ${selectedVerse?.text === v.secondaryText ? 'selected-verse' : ''}`}
                    onClick={() => setSelectedVerse({ verseObj: v, text: v.secondaryText, langLabel: secondaryLang })}
                    style={{ 
                      fontSize: '1.1rem', 
                      margin: 0, 
                      cursor: 'pointer', 
                      lineHeight: 1.5,
                      color: 'var(--text-secondary)'
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

      {/* Floating Action Menu Overlay */}
      {selectedVerse && (
        <div 
          onClick={() => setSelectedVerse(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '80px' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel"
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              display: 'flex',
              gap: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <button 
              onClick={() => { toggleHighlight(selectedVerse.verseObj, selectedVerse.text, selectedVerse.langLabel); setSelectedVerse(null); }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: isHighlighted(selectedVerse.verseObj.verseNum, selectedVerse.text) ? 'var(--accent-gold)' : 'var(--text-primary)' }}
            >
              <span className="material-symbols-rounded" style={{ fontVariationSettings: isHighlighted(selectedVerse.verseObj.verseNum, selectedVerse.text) ? "'FILL' 1" : "'FILL' 0" }}>format_ink_highlighter</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Highlight</span>
            </button>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <button 
              onClick={handleCopy}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-primary)' }}
            >
              <span className="material-symbols-rounded">content_copy</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Copy</span>
            </button>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <button 
              onClick={() => {
                const ref = `${book} ${chapter}:${selectedVerse.verseObj.verseNum}`;
                setNoteModal({ isOpen: true, verseRef: ref, text: verseNotes[ref] || '' });
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-primary)' }}
            >
              <span className="material-symbols-rounded">edit_note</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Note</span>
            </button>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <button 
              onClick={handleShare}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-primary)' }}
            >
              <span className="material-symbols-rounded">share</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Share</span>
            </button>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <button 
              onClick={handleCompare}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-primary)' }}
            >
              <span className="material-symbols-rounded">difference</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Compare</span>
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {compareModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Verse Comparison</h3>
              <button 
                onClick={() => setCompareModal({ isOpen: false, loading: false, data: [] })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {compareModal.loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px 0' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '2rem', animation: 'spin 2s linear infinite', color: 'var(--accent-blue)' }}>autorenew</span>
                  <p style={{ color: 'var(--text-secondary)' }}>Loading translations...</p>
                </div>
              ) : compareModal.data.length > 0 ? (
                compareModal.data.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '12px', borderBottom: idx !== compareModal.data.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>{item.name}</span>
                    <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>{item.text}</p>
                  </div>
                ))
              ) : (
                <p>No comparisons available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {noteModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Note for {noteModal.verseRef}</h3>
            <textarea
              autoFocus
              value={noteModal.text}
              onChange={(e) => setNoteModal({ ...noteModal, text: e.target.value })}
              style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'none', fontFamily: 'inherit', fontSize: '1rem' }}
              placeholder="Write your thoughts here..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setNoteModal({ isOpen: false, verseRef: '', text: '' })}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--bg-secondary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--accent-blue)', color: 'white', cursor: 'pointer', fontWeight: 600 }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
