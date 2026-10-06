'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { bookSummaries } from '../data/bookSummaries';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft, 
  Edit3, 
  Check, 
  Trash2, 
  Sparkles, 
  FileText, 
  Layers, 
  ExternalLink, 
  X,
  Bookmark
} from 'lucide-react';

const OLD_TESTAMENT_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const NEW_TESTAMENT_BOOKS = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", 
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", 
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

// Helper to parse verse reference like "Genesis 1:1" into book and chapter
function parseVerseRef(ref) {
  if (!ref) return { book: 'Genesis', chapter: 1 };
  const lastSpace = ref.lastIndexOf(' ');
  if (lastSpace === -1) return { book: ref, chapter: 1 };
  const bookPart = ref.substring(0, lastSpace);
  const chapterAndVerse = ref.substring(lastSpace + 1);
  const chapter = parseInt(chapterAndVerse.split(':')[0]) || 1;
  return { book: bookPart, chapter };
}

export default function StudyNotesPage() {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'notes'
  const [selectedBook, setSelectedBook] = useState(null);
  const [testamentFilter, setTestamentFilter] = useState('all'); // 'all', 'ot', 'nt'
  const [searchQuery, setSearchQuery] = useState('');
  
  // User personal notes storage
  const [chapterNotes, setChapterNotes] = useState({});
  const [bookNotes, setBookNotes] = useState({});
  const [editingBookNote, setEditingBookNote] = useState('');
  const [bookNoteSaved, setBookNoteSaved] = useState(false);
  const [activeChapterNoteEditor, setActiveChapterNoteEditor] = useState(null); // chapter number
  const [tempChapterNoteText, setTempChapterNoteText] = useState('');
  const [chapterNoteSaved, setChapterNoteSaved] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const storedChapterNotes = JSON.parse(localStorage.getItem('cw_chapter_notes') || '{}');
      const storedBookNotes = JSON.parse(localStorage.getItem('cw_book_notes') || '{}');
      setChapterNotes(storedChapterNotes);
      setBookNotes(storedBookNotes);
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  }, []);

  // When a book is selected, initialize book note editor
  useEffect(() => {
    if (selectedBook) {
      setEditingBookNote(bookNotes[selectedBook] || '');
      setActiveChapterNoteEditor(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedBook, bookNotes]);

  // Save book note
  const handleSaveBookNote = () => {
    if (!selectedBook) return;
    try {
      const updated = { ...bookNotes };
      if (editingBookNote.trim()) {
        updated[selectedBook] = editingBookNote.trim();
      } else {
        delete updated[selectedBook];
      }
      setBookNotes(updated);
      localStorage.setItem('cw_book_notes', JSON.stringify(updated));
      setBookNoteSaved(true);
      setTimeout(() => setBookNoteSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save book note', e);
    }
  };

  // Save chapter note inside detail view
  const handleSaveChapterNote = (chapterNum) => {
    if (!selectedBook) return;
    try {
      const ref = `${selectedBook} ${chapterNum}`;
      const updated = { ...chapterNotes };
      if (tempChapterNoteText.trim()) {
        updated[ref] = tempChapterNoteText.trim();
      } else {
        delete updated[ref];
      }
      setChapterNotes(updated);
      localStorage.setItem('cw_chapter_notes', JSON.stringify(updated));
      setChapterNoteSaved(true);
      setTimeout(() => {
        setChapterNoteSaved(false);
        setActiveChapterNoteEditor(null);
      }, 1000);
    } catch (e) {
      console.error('Failed to save chapter note', e);
    }
  };

  // Delete a note from My Notes tab
  const handleDeleteNote = (type, key) => {
    if (type === 'book') {
      const updated = { ...bookNotes };
      delete updated[key];
      setBookNotes(updated);
      localStorage.setItem('cw_book_notes', JSON.stringify(updated));
    } else {
      const updated = { ...chapterNotes };
      delete updated[key];
      setChapterNotes(updated);
      localStorage.setItem('cw_chapter_notes', JSON.stringify(updated));
    }
  };

  // Filter books list
  const filteredBooks = useMemo(() => {
    let list = [];
    if (testamentFilter === 'all') {
      list = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];
    } else if (testamentFilter === 'ot') {
      list = OLD_TESTAMENT_BOOKS;
    } else {
      list = NEW_TESTAMENT_BOOKS;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b => {
        const info = bookSummaries[b];
        if (b.toLowerCase().includes(q)) return true;
        if (info?.author?.toLowerCase().includes(q)) return true;
        if (info?.keyThemes?.some(t => t.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return list;
  }, [testamentFilter, searchQuery]);

  // Compute total user notes
  const totalNotesCount = Object.keys(bookNotes).length + Object.keys(chapterNotes).length;

  return (
    <div style={{ paddingBottom: '32px' }}>
      
      {/* Page Title & Header */}
      {!selectedBook && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              background: 'var(--accent-purple-light)',
              color: 'var(--accent-purple)',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex'
            }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Study Notes
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Book introductions, chapter guides & personal reflections
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
            <button
              onClick={() => setActiveTab('browse')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: '1px solid',
                borderColor: activeTab === 'browse' ? 'var(--accent-blue)' : 'var(--border-color)',
                backgroundColor: activeTab === 'browse' ? 'var(--accent-blue-light)' : 'var(--bg-card)',
                color: activeTab === 'browse' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Layers size={16} />
              <span>Browse Books (66)</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: '1px solid',
                borderColor: activeTab === 'notes' ? 'var(--accent-gold)' : 'var(--border-color)',
                backgroundColor: activeTab === 'notes' ? 'var(--accent-gold-light)' : 'var(--bg-card)',
                color: activeTab === 'notes' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FileText size={16} />
              <span>My Notes ({totalNotesCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          VIEW 1: BOOK DETAIL VIEW
          ========================================= */}
      {selectedBook && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Back Button & Top Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedBook(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              Back to Books
            </button>

            <Link
              href={`/bible?book=${encodeURIComponent(selectedBook)}&chapter=1`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-blue-grad)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <BookOpen size={16} />
              Read in Bible
            </Link>
          </div>

          {/* Book Header Card */}
          {bookSummaries[selectedBook] && (
            <>
              <div className="study-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-purple" style={{ marginBottom: '6px' }}>
                      {OLD_TESTAMENT_BOOKS.includes(selectedBook) ? 'Old Testament' : 'New Testament'}
                    </span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                      {selectedBook}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {bookSummaries[selectedBook].author && (
                      <span className="badge badge-blue">
                        Author: {bookSummaries[selectedBook].author}
                      </span>
                    )}
                    {bookSummaries[selectedBook].chapters && (
                      <span className="badge badge-gold">
                        {Object.keys(bookSummaries[selectedBook].chapters).length} Chapters
                      </span>
                    )}
                  </div>
                </div>

                {bookSummaries[selectedBook].writtenTo && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: '0 0 12px', fontWeight: 500 }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Audience:</strong> {bookSummaries[selectedBook].writtenTo}
                  </p>
                )}

                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                  {bookSummaries[selectedBook].summary}
                </p>

                {/* Key Themes Badges */}
                {bookSummaries[selectedBook].keyThemes && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      Major Themes
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {bookSummaries[selectedBook].keyThemes.map((theme, i) => (
                        <span key={i} className="theme-tag">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Verses Section */}
              {bookSummaries[selectedBook].keyVerses && bookSummaries[selectedBook].keyVerses.length > 0 && (
                <div className="card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} /> Key Verses
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {bookSummaries[selectedBook].keyVerses.map((ref, idx) => {
                      const { book, chapter } = parseVerseRef(ref);
                      return (
                        <Link
                          key={idx}
                          href={`/bible?book=${encodeURIComponent(book)}&chapter=${chapter}`}
                          className="theme-tag gold"
                          style={{
                            padding: '8px 14px',
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                          title={`Read ${ref} in Bible`}
                        >
                          <BookOpen size={14} />
                          <span>{ref}</span>
                          <ExternalLink size={12} style={{ opacity: 0.7 }} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Important Teaching Points */}
              {bookSummaries[selectedBook].importantNotes && bookSummaries[selectedBook].importantNotes.length > 0 && (
                <div className="card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap size={18} style={{ color: 'var(--accent-blue)' }} /> Important Teaching Points
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {bookSummaries[selectedBook].importantNotes.map((note, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'var(--accent-gold-light)',
                          color: 'var(--accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {idx + 1}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Personal Book Note Editor */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={18} style={{ color: 'var(--accent-gold)' }} />
                    My Notes on {selectedBook}
                  </h3>
                  {bookNotes[selectedBook] && (
                    <span className="badge badge-gold">Saved</span>
                  )}
                </div>

                <textarea
                  className="note-editor"
                  rows={4}
                  value={editingBookNote}
                  onChange={(e) => setEditingBookNote(e.target.value)}
                  placeholder={`Write your personal study insights, theological notes, or reflections on the book of ${selectedBook}...`}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                  {bookNoteSaved && (
                    <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={16} /> Note Saved!
                    </span>
                  )}
                  <button
                    onClick={handleSaveBookNote}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-blue)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Save Book Note
                  </button>
                </div>
              </div>

              {/* Chapter-by-Chapter Guide */}
              {bookSummaries[selectedBook].chapters && (
                <div style={{ marginTop: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-blue)' }} /> Chapter Summaries
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(bookSummaries[selectedBook].chapters).map(([chNum, summaryText]) => {
                      const chapterRef = `${selectedBook} ${chNum}`;
                      const hasNote = !!chapterNotes[chapterRef];
                      const isEditing = activeChapterNoteEditor === chNum;

                      return (
                        <div key={chNum} className="card" style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <span className="badge badge-blue">
                                  Chapter {chNum}
                                </span>
                                {hasNote && (
                                  <span className="badge badge-gold" title="Has personal note">
                                    Note Added
                                  </span>
                                )}
                              </div>
                              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                                {summaryText}
                              </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                              <Link
                                href={`/bible?book=${encodeURIComponent(selectedBook)}&chapter=${chNum}`}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--accent-blue)',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  justifyContent: 'center'
                                }}
                              >
                                Read <ChevronRight size={14} />
                              </Link>

                              <button
                                onClick={() => {
                                  if (isEditing) {
                                    setActiveChapterNoteEditor(null);
                                  } else {
                                    setActiveChapterNoteEditor(chNum);
                                    setTempChapterNoteText(chapterNotes[chapterRef] || '');
                                  }
                                }}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: hasNote ? 'var(--accent-gold-light)' : 'var(--bg-secondary)',
                                  border: '1px solid var(--border-color)',
                                  color: hasNote ? 'var(--accent-gold)' : 'var(--text-secondary)',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  justifyContent: 'center'
                                }}
                              >
                                <Edit3 size={12} />
                                {hasNote ? 'Edit Note' : 'Add Note'}
                              </button>
                            </div>
                          </div>

                          {/* Existing Note Display if not editing */}
                          {hasNote && !isEditing && (
                            <div style={{
                              marginTop: '10px',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--accent-gold-light)',
                              border: '1px solid rgba(245, 158, 11, 0.2)',
                              fontSize: '0.85rem',
                              color: 'var(--text-primary)'
                            }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>
                                Your Note:
                              </span>
                              {chapterNotes[chapterRef]}
                            </div>
                          )}

                          {/* Inline Chapter Note Editor */}
                          {isEditing && (
                            <div className="fade-in" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <textarea
                                className="note-editor"
                                rows={2}
                                value={tempChapterNoteText}
                                onChange={(e) => setTempChapterNoteText(e.target.value)}
                                placeholder={`Write your note for ${selectedBook} ${chNum}...`}
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                {chapterNoteSaved && (
                                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Check size={14} /> Saved
                                  </span>
                                )}
                                <button
                                  onClick={() => setActiveChapterNoteEditor(null)}
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveChapterNote(chNum)}
                                  style={{
                                    padding: '5px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--accent-blue)',
                                    color: '#fff',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}

      {/* =========================================
          VIEW 2: BROWSE ALL BOOKS TAB
          ========================================= */}
      {!selectedBook && activeTab === 'browse' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, or key themes..."
              style={{
                width: '100%',
                padding: '12px 40px 12px 42px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Testament Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'all', label: 'All (66)' },
              { id: 'ot', label: 'Old Testament (39)' },
              { id: 'nt', label: 'New Testament (27)' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setTestamentFilter(filter.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: testamentFilter === filter.id ? 'var(--accent-blue)' : 'var(--border-color)',
                  backgroundColor: testamentFilter === filter.id ? 'var(--accent-blue)' : 'var(--bg-card)',
                  color: testamentFilter === filter.id ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Book Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px', marginTop: '4px' }}>
            {filteredBooks.map(bookName => {
              const info = bookSummaries[bookName];
              const isOT = OLD_TESTAMENT_BOOKS.includes(bookName);
              const hasBookNote = !!bookNotes[bookName];
              
              // Count chapter notes for this book
              const chapterNotesForBook = Object.keys(chapterNotes).filter(k => k.startsWith(`${bookName} `)).length;

              return (
                <div
                  key={bookName}
                  onClick={() => setSelectedBook(bookName)}
                  className="study-card"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '170px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className={`badge ${isOT ? 'badge-purple' : 'badge-blue'}`}>
                        {isOT ? 'OT' : 'NT'} • {info?.chapters ? Object.keys(info.chapters).length : ''} Ch
                      </span>
                      
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {hasBookNote && (
                          <span className="badge badge-gold" title="Has book note">
                            Note
                          </span>
                        )}
                        {chapterNotesForBook > 0 && (
                          <span className="badge badge-gold" title={`${chapterNotesForBook} chapter notes`}>
                            {chapterNotesForBook} notes
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                      {bookName}
                    </h3>

                    {info?.author && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: '0 0 8px', fontWeight: 600 }}>
                        By {info.author}
                      </p>
                    )}

                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {info?.summary}
                    </p>
                  </div>

                  {/* Themes preview */}
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '80%' }}>
                      {info?.keyThemes?.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="theme-tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                          {t}
                        </span>
                      ))}
                      {info?.keyThemes && info.keyThemes.length > 2 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
                          +{info.keyThemes.length - 2}
                        </span>
                      )}
                    </div>

                    <ChevronRight size={18} style={{ color: 'var(--accent-blue)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 6px' }}>No books found matching "{searchQuery}"</p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>Try searching for a different keyword or book title.</p>
            </div>
          )}

        </div>
      )}

      {/* =========================================
          VIEW 3: MY PERSONAL NOTES TAB
          ========================================= */}
      {!selectedBook && activeTab === 'notes' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {totalNotesCount === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-gold-light)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Edit3 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No Study Notes Yet
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                You can add personal reflections and study insights while reading any chapter in the Bible reader, or directly from any book's study guide.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-blue-grad)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Browse Books & Start Studying
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Book-level Notes */}
              {Object.keys(bookNotes).length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bookmark size={18} style={{ color: 'var(--accent-gold)' }} /> Book Study Notes ({Object.keys(bookNotes).length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(bookNotes).map(([bookName, noteText]) => (
                      <div key={bookName} className="card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {bookName}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedBook(bookName)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--accent-blue-light)',
                                color: 'var(--accent-blue)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Open Book Guide
                            </button>
                            <button
                              onClick={() => handleDeleteNote('book', bookName)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--bg-secondary)',
                                color: '#ef4444',
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                              title="Delete note"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                          {noteText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapter-level Notes */}
              {Object.keys(chapterNotes).length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} style={{ color: 'var(--accent-blue)' }} /> Chapter Reflections ({Object.keys(chapterNotes).length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(chapterNotes).map(([ref, noteText]) => {
                      const { book, chapter } = parseVerseRef(ref);
                      return (
                        <div key={ref} className="card" style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {ref}
                              </span>
                              <span className="badge badge-blue">
                                Chapter Note
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Link
                                href={`/bible?book=${encodeURIComponent(book)}&chapter=${chapter}`}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--accent-blue-light)',
                                  color: 'var(--accent-blue)',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                Read <ExternalLink size={12} />
                              </Link>
                              <button
                                onClick={() => handleDeleteNote('chapter', ref)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--bg-secondary)',
                                  color: '#ef4444',
                                  fontSize: '0.78rem',
                                  cursor: 'pointer'
                                }}
                                title="Delete note"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                            {noteText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
