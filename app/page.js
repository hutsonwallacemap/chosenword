'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { dailyVerses, dailyQuizzes } from './data/dailyContent';

// Seeded random number generator
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export default function Home() {
  const [dailyData, setDailyData] = useState(null);
  const [quizState, setQuizState] = useState({});

  useEffect(() => {
    // Calculate Day of Year (1-365)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Use dayOfYear as seed
    const random = mulberry32(dayOfYear);
    
    // Pick Verse
    const verseIndex = Math.floor(random() * dailyVerses.length);
    const verse = dailyVerses[verseIndex];
    
    // Pick 3 Quizzes
    const shuffledQuizzes = [...dailyQuizzes].sort(() => 0.5 - random());
    const selectedQuizzes = shuffledQuizzes.slice(0, 3);
    
    setDailyData({
      day: dayOfYear,
      verse,
      quizzes: selectedQuizzes
    });
    
    // Load quiz progress from localStorage
    const savedState = localStorage.getItem(`cw_quiz_${dayOfYear}`);
    if (savedState) {
      setQuizState(JSON.parse(savedState));
    }
  }, []);

  const handleQuizAnswer = (quizIndex, selectedOptionIndex) => {
    if (quizState[quizIndex] !== undefined) return; // Already answered
    
    const newState = {
      ...quizState,
      [quizIndex]: selectedOptionIndex
    };
    setQuizState(newState);
    if (dailyData) {
      localStorage.setItem(`cw_quiz_${dailyData.day}`, JSON.stringify(newState));
    }
  };

  if (!dailyData) return null; // Hydration

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Verse of the Day Card */}
      <div style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://picsum.photos/seed/${dailyData.day}/800/600)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Glassmorphism overlay behind text */}
        <div style={{
          position: 'absolute',
          inset: '10px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, padding: '16px' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', opacity: 0.9 }}>
            Verse of the Day
          </p>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 500, fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.4, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            "{dailyData.verse.text}"
          </h2>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', opacity: 0.9 }}>{dailyData.verse.reference}</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '-16px', paddingLeft: '8px' }}>Explore</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Link href="/bible" className="card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'var(--accent-blue-light)',
            padding: '16px',
            borderRadius: '50%',
            display: 'flex',
            color: 'var(--accent-blue)'
          }}>
            <span className="material-symbols-rounded" style={{ fontSize: '2.5rem' }}>auto_stories</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Read Bible</h3>
        </Link>
        
        <Link href="/saved" className="card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'var(--accent-gold-light)',
            padding: '16px',
            borderRadius: '50%',
            display: 'flex',
            color: 'var(--accent-gold)'
          }}>
            <span className="material-symbols-rounded" style={{ fontSize: '2.5rem' }}>bookmark</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Saved Items</h3>
        </Link>
      </div>

      {/* Daily Quiz Section */}
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded">quiz</span> Daily Quiz
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {dailyData.quizzes.map((quiz, qIndex) => {
            const answered = quizState[qIndex] !== undefined;
            const selected = quizState[qIndex];
            
            return (
              <div key={qIndex} className="card" style={{ padding: '20px' }}>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '16px', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                  {qIndex + 1}. {quiz.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {quiz.options.map((opt, optIndex) => {
                    let btnStyle = {
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      fontWeight: 500,
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    };
                    
                    let icon = null;

                    if (answered) {
                      if (optIndex === quiz.answer) {
                        btnStyle.backgroundColor = '#dcfce7'; // green-100
                        btnStyle.borderColor = '#22c55e'; // green-500
                        btnStyle.color = '#166534'; // green-800
                        icon = <span className="material-symbols-rounded" style={{ color: '#22c55e' }}>check_circle</span>;
                      } else if (optIndex === selected) {
                        btnStyle.backgroundColor = '#fee2e2'; // red-100
                        btnStyle.borderColor = '#ef4444'; // red-500
                        btnStyle.color = '#991b1b'; // red-800
                        icon = <span className="material-symbols-rounded" style={{ color: '#ef4444' }}>cancel</span>;
                      }
                    }

                    return (
                      <button 
                        key={optIndex}
                        className={!answered ? "quiz-btn" : ""}
                        style={btnStyle}
                        onClick={() => handleQuizAnswer(qIndex, optIndex)}
                        disabled={answered}
                      >
                        <span>{opt}</span>
                        {icon}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
