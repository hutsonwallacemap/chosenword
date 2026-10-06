'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookMarked, 
  Search, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  X, 
  Loader2, 
  ArrowLeft,
  GraduationCap,
  Layers,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

const SUGGESTED_TERMS = [
  "grace", "faith", "covenant", "righteousness", "atonement", 
  "redemption", "salvation", "repentance", "holiness", "mercy", 
  "gospel", "propitiation", "justification", "sanctification", 
  "messiah", "shalom", "selah", "agape", "trinity", "resurrection"
];

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('grace');
  const [currentResult, setCurrentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);

  const fetchDefinition = async (wordToSearch) => {
    const word = (wordToSearch || searchTerm).trim();
    if (!word) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/dictionary?word=${encodeURIComponent(word)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || `No definition found for "${word}".`);
        setCurrentResult(null);
      } else {
        setCurrentResult(data);
        setError('');
      }
    } catch (err) {
      console.error('Dictionary search failed', err);
      setError('Unable to load word definition. Please check your network connection.');
      setCurrentResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchDefinition('grace');
  }, []);

  const handleSelectSuggested = (term) => {
    setSearchTerm(term);
    fetchDefinition(term);
  };

  const handlePlayAudio = () => {
    if (!currentResult) return;

    // 1. Try audio URL from API if available
    if (currentResult.audio) {
      try {
        const audio = new Audio(currentResult.audio);
        setAudioPlaying(true);
        audio.play()
          .then(() => {
            audio.onended = () => setAudioPlaying(false);
          })
          .catch(() => {
            playSpeechSynthesis(currentResult.word);
          });
        return;
      } catch (e) {
        // Fallback to speechSynthesis
      }
    }

    // 2. Fallback to Web Speech API
    playSpeechSynthesis(currentResult.word);
  };

  const playSpeechSynthesis = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setAudioPlaying(true);
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            background: 'var(--accent-blue-light)',
            color: 'var(--accent-blue)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <BookMarked size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Biblical Lexicon & Dictionary
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Discover word meanings, audio pronunciations, and Hebrew & Greek roots
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <form 
          onSubmit={(e) => { e.preventDefault(); fetchDefinition(searchTerm); }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any biblical word (e.g., grace, covenant, selah)..."
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0 22px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-blue-grad)',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
            <span>Lookup</span>
          </button>
        </form>

        {/* Suggested Biblical Term Chips */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.5px' }}>
            Popular Biblical Terms
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SUGGESTED_TERMS.map((term) => (
              <button
                key={term}
                onClick={() => handleSelectSuggested(term)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '100px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: searchTerm.toLowerCase() === term ? 'var(--accent-blue)' : 'var(--border-color)',
                  backgroundColor: searchTerm.toLowerCase() === term ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
                  color: searchTerm.toLowerCase() === term ? 'var(--accent-blue)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
            Searching biblical lexicon and dictionary...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="card" style={{ padding: '32px 20px', textAlign: 'center', borderLeft: '4px solid #ef4444' }}>
          <HelpCircle size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 6px', color: 'var(--text-primary)' }}>Word Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 16px' }}>
            {error}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Link
              href={`/search?q=${encodeURIComponent(searchTerm)}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Search size={16} />
              Search &quot;{searchTerm}&quot; in Bible Text
            </Link>
          </div>
        </div>
      )}

      {/* Definition Result Card */}
      {currentResult && !loading && (
        <div className="card fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Word & Audio Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, textTransform: 'capitalize' }}>
                {currentResult.word}
              </h2>
              {currentResult.phonetic && (
                <span style={{ fontSize: '1rem', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '4px', display: 'inline-block' }}>
                  {currentResult.phonetic}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handlePlayAudio}
                title="Listen to native pronunciation"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '100px',
                  backgroundColor: audioPlaying ? 'var(--accent-blue)' : 'var(--accent-blue-light)',
                  color: audioPlaying ? 'white' : 'var(--accent-blue)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Volume2 size={18} className={audioPlaying ? 'pulse' : ''} />
                <span>{audioPlaying ? 'Speaking...' : 'Pronounce'}</span>
              </button>

              <Link
                href={`/search?q=${encodeURIComponent(currentResult.word)}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  borderRadius: '100px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                <BookOpen size={16} />
                <span>Search in Bible</span>
              </Link>
            </div>
          </div>

          {/* Theological & Biblical Context Box */}
          {currentResult.biblicalContext && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.14) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              borderLeft: '4px solid var(--accent-gold)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Sparkles size={16} />
                Biblical & Theological Root
              </div>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', fontWeight: 500 }}>
                {currentResult.biblicalContext}
              </p>
            </div>
          )}

          {/* Meanings by Part of Speech */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentResult.meanings && currentResult.meanings.map((meaning, mIdx) => (
              <div key={mIdx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontStyle: 'italic', 
                    fontSize: '0.9rem', 
                    fontWeight: 700, 
                    color: 'var(--accent-blue)', 
                    textTransform: 'lowercase',
                    background: 'var(--bg-secondary)',
                    padding: '2px 10px',
                    borderRadius: '6px'
                  }}>
                    {meaning.partOfSpeech}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <ol style={{ margin: 0, paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {meaning.definitions && meaning.definitions.map((def, dIdx) => (
                    <li key={dIdx} style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      <p style={{ margin: '0 0 4px', fontSize: '1rem' }}>
                        {def.definition}
                      </p>
                      {def.example && (
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                          &ldquo;{def.example}&rdquo;
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Bottom Cross-links to Study Notes & Bible Reader */}
      <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <Link 
          href="/calendar"
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Biblical Feasts Calendar</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Explore God&apos;s holy convocations & timing</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
        </Link>

        <Link 
          href="/places"
          className="card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Biblical Places & Maps</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sacred sites and coordinates across Scripture</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
        </Link>
      </div>

    </div>
  );
}
