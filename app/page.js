'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { dailyVerses, dailyQuizzes } from './data/dailyContent';
import { Flame, Trophy, BookOpen, Search, Library, Bookmark, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

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
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });

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

    // Streaks Logic
    const todayStr = now.toDateString();
    const lastOpen = localStorage.getItem('cw_last_open');
    let currentStreak = parseInt(localStorage.getItem('cw_current_streak') || '0');
    let longestStreak = parseInt(localStorage.getItem('cw_longest_streak') || '0');

    if (lastOpen !== todayStr) {
      if (lastOpen) {
        const lastDate = new Date(lastOpen);
        const diffDays = Math.floor((now - lastDate) / oneDay);
        
        if (diffDays === 1) {
          // Opened yesterday, continue streak
          currentStreak += 1;
        } else if (diffDays > 1) {
          // Missed a day, reset streak
          currentStreak = 1;
        }
      } else {
        // First time opening
        currentStreak = 1;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        localStorage.setItem('cw_longest_streak', longestStreak.toString());
      }

      localStorage.setItem('cw_current_streak', currentStreak.toString());
      localStorage.setItem('cw_last_open', todayStr);
    }
    
    setStreaks({ current: currentStreak, longest: longestStreak });
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
      
      {/* Streaks Banner */}
      <div className="card" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 20px',
        borderLeft: '4px solid #f97316'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #ffedd5 0%, #ffc82c 100%)', 
            padding: '10px', 
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(249, 115, 22, 0.2)'
          }}>
            <Flame size={24} style={{ color: '#ea580c', fill: '#ea580c' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Current Streak</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{streaks.current} Day{streaks.current !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div style={{ height: '40px', width: '1px', background: 'var(--border-color)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #fefce8 0%, #fde047 100%)', 
            padding: '10px', 
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(234, 179, 8, 0.2)'
          }}>
            <Trophy size={24} style={{ color: '#ca8a04', fill: '#ca8a04' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Longest</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{streaks.longest} Day{streaks.longest !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Hero Verse of the Day Card */}
      <div style={{
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.8)), url(https://picsum.photos/seed/${dailyData.day}/800/600)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 24px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Glassmorphism overlay behind text */}
        <div style={{
          position: 'absolute',
          inset: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, padding: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '20px' }}>
             <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#fbbf24' }}>Verse of the Day</p>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 500, fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.5, textShadow: '0 4px 8px rgba(0,0,0,0.4)', letterSpacing: '-0.01em' }}>
            "{dailyData.verse.text}"
          </h2>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', opacity: 0.9, letterSpacing: '0.5px' }}>{dailyData.verse.reference}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', paddingLeft: '4px', letterSpacing: '-0.02em' }}>Explore</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Link href="/bible" className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textDecoration: 'none',
            padding: '24px 16px'
          }}>
            <div style={{
              background: 'var(--accent-blue-light)',
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              color: 'var(--accent-blue)'
            }}>
              <BookOpen size={32} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>Read Bible</h3>
          </Link>
          
          <Link href="/search" className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textDecoration: 'none',
            padding: '24px 16px'
          }}>
            <div style={{
              background: '#e0e7ff', // indigo-100
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              color: '#4f46e5' // indigo-600
            }}>
              <Search size={32} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>Search</h3>
          </Link>
   
          <Link href="/plans" className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textDecoration: 'none',
            padding: '24px 16px'
          }}>
            <div style={{
              background: '#fce7f3', // pink-100
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              color: '#db2777' // pink-600
            }}>
              <Library size={32} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>Plans</h3>
          </Link>
   
          <Link href="/saved" className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textDecoration: 'none',
            padding: '24px 16px'
          }}>
            <div style={{
              background: 'var(--accent-gold-light)',
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              color: 'var(--accent-gold)'
            }}>
              <Bookmark size={32} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>Saved</h3>
          </Link>
        </div>
      </div>

      {/* Daily Quiz Section */}
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} /> Daily Quiz
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
                        icon = <CheckCircle2 size={18} style={{ color: '#22c55e' }} />;
                      } else if (optIndex === selected) {
                        btnStyle.backgroundColor = '#fee2e2'; // red-100
                        btnStyle.borderColor = '#ef4444'; // red-500
                        btnStyle.color = '#991b1b'; // red-800
                        icon = <XCircle size={18} style={{ color: '#ef4444' }} />;
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
