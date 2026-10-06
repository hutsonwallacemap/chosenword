'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getFeastsWithDynamicDates } from '../data/biblicalCalendar';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Sun, 
  Moon, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Loader2,
  Bookmark,
  Share2,
  Volume2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function BiblicalCalendarPage() {
  const [filter, setFilter] = useState('seven'); // 'seven', 'spring', 'fall', 'historical', 'all'
  const [expandedId, setExpandedId] = useState('passover');
  const [calendarData, setCalendarData] = useState(() => getFeastsWithDynamicDates(new Date()));
  const [playingShofar, setPlayingShofar] = useState(false);

  useEffect(() => {
    // Re-evaluate with client's exact local time
    setCalendarData(getFeastsWithDynamicDates(new Date()));
  }, []);

  const feasts = calendarData.feasts || [];
  const nextFeast = calendarData.nextFeast || feasts[0];

  const filteredFeasts = useMemo(() => {
    return feasts.filter(f => {
      if (filter === 'all') return true;
      if (filter === 'seven') {
        return ['passover', 'unleavened_bread', 'firstfruits', 'pentecost', 'trumpets', 'atonement', 'tabernacles'].includes(f.id);
      }
      if (filter === 'spring') return f.season === 'spring';
      if (filter === 'fall') return f.season === 'fall';
      if (filter === 'historical') return f.season === 'historical' || f.season === 'weekly';
      return true;
    });
  }, [feasts, filter]);

  // Authentic Shofar horn sound synthesized via Web Audio API (zero audio file download needed!)
  const playShofarBlast = (type = 'tekiah') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      setPlayingShofar(true);

      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Authentic brassy ram's horn timbre using sawtooth with gentle lowpass
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        // Slight pitch rise typical of blowing a horn
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + duration * 0.4);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.08);
        gain.gain.setValueAtTime(0.3, startTime + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      const baseFreq = 220; // A3 pitch

      if (type === 'tekiah') {
        // One long triumphant blast (2.4s)
        playTone(baseFreq, now, 2.4);
        setTimeout(() => setPlayingShofar(false), 2500);
      } else if (type === 'teruah') {
        // 9 short staccato blasts
        for (let i = 0; i < 9; i++) {
          playTone(baseFreq * 1.1, now + (i * 0.18), 0.12);
        }
        setTimeout(() => setPlayingShofar(false), 2000);
      }
    } catch (e) {
      console.error('Audio synthesis failed', e);
      setPlayingShofar(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            color: '#b45309',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <CalendarIcon size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Biblical Feasts & Holy Days
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              The Moedim (Appointed Times) of the Lord, biblical calendar, and prophetic fulfillment in Christ
            </p>
          </div>
        </div>
      </div>

      {/* Featured Next Upcoming Feast Hero Card */}
      {nextFeast && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ 
                  background: 'rgba(245, 158, 11, 0.25)', 
                  color: '#fbbf24', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  padding: '3px 10px', 
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Next Appointed Season
                </span>
                
                {nextFeast.daysUntil !== null && (
                  <span style={{ 
                    fontSize: '0.82rem', 
                    fontWeight: 700,
                    color: nextFeast.daysUntil <= 7 ? '#4ade80' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={14} />
                    {nextFeast.daysUntil === 0 ? 'Today!' : nextFeast.daysUntil === 1 ? 'Tomorrow!' : `In ${nextFeast.daysUntil} days`}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {nextFeast.name}
                </h2>
                <span style={{ fontSize: '1.5rem', fontFamily: 'serif', color: '#fde68a' }}>
                  {nextFeast.hebrewName}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  ({nextFeast.transliteration})
                </span>
              </div>
              
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '8px 0 0', maxWidth: '580px' }}>
                {nextFeast.biblicalTiming} &bull; <strong style={{ color: '#fef08a' }}>{nextFeast.gregorianDate}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href={`/bible?book=${encodeURIComponent(nextFeast.primaryBook)}&chapter=${nextFeast.primaryChapter}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-gold-grad)',
                  color: '#1e293b',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)'
                }}
              >
                <BookOpen size={16} />
                <span>Read in {nextFeast.primaryBook} {nextFeast.primaryChapter}</span>
              </Link>

              {/* Shofar sound blast button */}
              <button
                onClick={() => playShofarBlast('tekiah')}
                disabled={playingShofar}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={16} style={{ color: '#fbbf24' }} />
                <span>{playingShofar ? 'Blowing Shofar...' : 'Sound the Shofar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '20px' }}>
        {[
          { id: 'seven', label: '7 Feasts of the Lord' },
          { id: 'spring', label: 'Spring Feasts (4)' },
          { id: 'fall', label: 'Fall Feasts (3)' },
          { id: 'historical', label: 'Historical & Weekly' },
          { id: 'all', label: 'All Holy Times' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: '1px solid',
              borderColor: filter === tab.id ? 'var(--accent-blue)' : 'var(--border-color)',
              backgroundColor: filter === tab.id ? 'var(--accent-blue-light)' : 'var(--bg-card)',
              color: filter === tab.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feasts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredFeasts.map((feast) => {
          const isExpanded = expandedId === feast.id;

          return (
            <div 
              key={feast.id}
              className="card fade-in"
              style={{
                padding: '24px',
                borderLeft: `4px solid ${feast.badgeColor || 'var(--accent-blue)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header row */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : feast.id)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '12px' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {feast.name}
                    </h3>
                    <span style={{ fontSize: '1.2rem', fontFamily: 'serif', color: feast.badgeColor || 'var(--accent-gold)' }}>
                      {feast.hebrewName}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      ({feast.transliteration} &mdash; &ldquo;{feast.englishTranslation}&rdquo;)
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{feast.biblicalTiming}</span>
                    <span>&bull;</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {feast.gregorianDate}
                    </span>
                    {feast.daysUntil !== null && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '1px 8px', 
                        borderRadius: '100px',
                        backgroundColor: feast.daysUntil <= 14 ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
                        color: feast.daysUntil <= 14 ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        fontWeight: 600
                      }}>
                        {feast.daysUntil === 0 ? 'Today' : `In ${feast.daysUntil}d`}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link
                    href={`/bible?book=${encodeURIComponent(feast.primaryBook)}&chapter=${feast.primaryChapter}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <BookOpen size={14} />
                    <span>Read {feast.primaryBook} {feast.primaryChapter}</span>
                  </Link>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : feast.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <ChevronRight size={20} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>
                </div>
              </div>

              {/* Biblical Overview */}
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {feast.overview}
              </p>

              {/* Collapsible Deep Details */}
              {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                  
                  {/* Prophetic Fulfillment Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.12) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    borderLeft: '4px solid var(--accent-gold)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <Sparkles size={16} />
                      Prophetic Fulfillment in Jesus Christ
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)', fontWeight: 500 }}>
                      {feast.propheticFulfillment}
                    </p>
                  </div>

                  {/* Observance and Meaning */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 6px', letterSpacing: '0.5px' }}>
                      Biblical Observance
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                      {feast.observance}
                    </p>
                  </div>

                  {/* Key Scriptures */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 8px', letterSpacing: '0.5px' }}>
                      Key Scriptures
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {feast.scriptures.map((sc, sIdx) => (
                        <div key={sIdx} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                            {sc.ref}
                          </span>
                          <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                            &ldquo;{sc.text}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom Navigation cross-links */}
      <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <Link 
          href="/dictionary"
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
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Biblical Lexicon & Dictionary</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Audio pronunciations & Hebrew/Greek terms</div>
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
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Interactive maps & sacred locations</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
        </Link>
      </div>

    </div>
  );
}
