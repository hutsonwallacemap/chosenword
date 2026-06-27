'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [translation, setTranslation] = useState('AKJV_offline');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [offlineDataCache, setOfflineDataCache] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    setResults([]);
    
    try {
      let fileName = translation;
      if (['AKJV_offline', 'ASV_offline', 'BBE_offline'].includes(translation)) {
        fileName = translation.replace('_offline', '');
      } else if (translation === 'hindi_offline') {
        fileName = 'hindi_offline';
      } else if (translation === 'ta_offline') {
        fileName = 'ta_offline';
      }

      let data = offlineDataCache[fileName];
      if (!data) {
        const res = await fetch(`/${fileName}.json`);
        if (!res.ok) throw new Error('Failed to load Bible database');
        data = await res.json();
        setOfflineDataCache(prev => ({ ...prev, [fileName]: data }));
      }

      const searchResults = [];
      const lowerQuery = query.toLowerCase();

      // Handle new JSON format (Array of books)
      if (data.books && Array.isArray(data.books)) {
        for (const book of data.books) {
          for (const chapter of book.chapters) {
            for (const verse of chapter.verses) {
              if (verse.text.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                  book: book.name,
                  chapter: chapter.chapter,
                  verse: verse.verse,
                  text: verse.text.replace(/<[^>]*>?/gm, '')
                });
                if (searchResults.length >= 100) break; // Limit results
              }
            }
            if (searchResults.length >= 100) break;
          }
          if (searchResults.length >= 100) break;
        }
      } 
      // Handle original JSON format (Nested objects)
      else {
        for (const bookName in data) {
          if (bookName === 'book' || bookName === 'count' || bookName === 'chapters') continue;
          const bookData = data[bookName];
          for (const chapNum in bookData) {
            const chapData = bookData[chapNum];
            for (const vNum in chapData) {
              const text = chapData[vNum];
              if (text && text.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                  book: bookName,
                  chapter: chapNum,
                  verse: vNum,
                  text: text
                });
                if (searchResults.length >= 100) break;
              }
            }
            if (searchResults.length >= 100) break;
          }
          if (searchResults.length >= 100) break;
        }
      }

      setResults(searchResults);
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)' }}
        >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Global Search</h1>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Search Keyword</label>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-rounded" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>search</span>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Love, Faith, Moses"
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', fontSize: '1.1rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                autoFocus
              />
            </div>
          </div>
          
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Translation</label>
            <select 
              className="custom-select"
              value={translation} 
              onChange={(e) => setTranslation(e.target.value)}
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            >
              <option value="AKJV_offline">English: AKJV (Fast Offline)</option>
              <option value="ASV_offline">English: ASV (Fast Offline)</option>
              <option value="BBE_offline">English: BBE (Fast Offline)</option>
              <option value="hindi_offline">Hindi (Fast Offline)</option>
              <option value="ta_offline">Tamil (Fast Offline)</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            style={{ 
              padding: '16px', 
              borderRadius: 'var(--radius-md)', 
              border: 'none', 
              background: 'var(--accent-blue)', 
              color: 'white', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              cursor: (loading || !query.trim()) ? 'not-allowed' : 'pointer',
              opacity: (loading || !query.trim()) ? 0.7 : 1,
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? <span className="material-symbols-rounded" style={{ animation: 'spin 2s linear infinite' }}>autorenew</span> : <span className="material-symbols-rounded">search</span>}
            {loading ? 'Searching...' : 'Search Bible'}
          </button>
        </form>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', color: '#ef4444', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
          <p>{error}</p>
        </div>
      )}

      {hasSearched && !loading && !error && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {results.length >= 100 ? 'Showing first 100 results' : `${results.length} Results Found`}
          </h3>
          
          {results.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>search_off</span>
              <p style={{ fontSize: '1.1rem' }}>No verses found containing "{query}"</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {results.map((r, i) => (
                <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {r.book} {r.chapter}:{r.verse}
                  </span>
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.5, margin: 0, color: 'var(--text-primary)' }}>
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
