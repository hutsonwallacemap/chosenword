'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const nt30Plan = [
  { day: 1, title: 'Matthew 1-4' }, { day: 2, title: 'Matthew 5-7' },
  { day: 3, title: 'Matthew 8-12' }, { day: 4, title: 'Matthew 13-16' },
  { day: 5, title: 'Matthew 17-21' }, { day: 6, title: 'Matthew 22-25' },
  { day: 7, title: 'Matthew 26-28' }, { day: 8, title: 'Mark 1-5' },
  { day: 9, title: 'Mark 6-9' }, { day: 10, title: 'Mark 10-12' },
  { day: 11, title: 'Mark 13-16' }, { day: 12, title: 'Luke 1-3' },
  { day: 13, title: 'Luke 4-6' }, { day: 14, title: 'Luke 7-9' },
  { day: 15, title: 'Luke 10-13' }, { day: 16, title: 'Luke 14-17' },
  { day: 17, title: 'Luke 18-21' }, { day: 18, title: 'Luke 22-24' },
  { day: 19, title: 'John 1-4' }, { day: 20, title: 'John 5-8' },
  { day: 21, title: 'John 9-12' }, { day: 22, title: 'John 13-16' },
  { day: 23, title: 'John 17-21' }, { day: 24, title: 'Acts 1-5' },
  { day: 25, title: 'Acts 6-10' }, { day: 26, title: 'Acts 11-15' },
  { day: 27, title: 'Acts 16-20' }, { day: 28, title: 'Acts 21-28' },
  { day: 29, title: 'Romans 1-8' }, { day: 30, title: 'Romans 9-16' }
];

export default function PlansPage() {
  const router = useRouter();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setProgress(JSON.parse(localStorage.getItem('cw_plan_nt30')) || {});
  }, []);

  const toggleDay = (day) => {
    const newProgress = { ...progress, [day]: !progress[day] };
    setProgress(newProgress);
    localStorage.setItem('cw_plan_nt30', JSON.stringify(newProgress));
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)' }}
        >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Reading Plans</h1>
      </div>

      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--accent-blue-light), var(--bg-secondary))', border: '1px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured Plan</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>30-Day Gospels & Acts</h2>
          </div>
          <span className="material-symbols-rounded" style={{ fontSize: '2.5rem', color: 'var(--accent-blue)' }}>library_books</span>
        </div>
        
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{completedCount} of 30 Days</span>
          <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{progressPercent}%</span>
        </div>
        
        <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: \`\${progressPercent}%\`, height: '100%', background: 'var(--accent-blue)', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)', paddingLeft: '8px', marginBottom: '8px' }}>Daily Schedule</h3>
        
        {nt30Plan.map((p) => (
          <div 
            key={p.day}
            className="card"
            style={{ 
              padding: '16px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              opacity: progress[p.day] ? 0.6 : 1,
              transition: 'all 0.2s',
              borderLeft: progress[p.day] ? '4px solid #22c55e' : '4px solid transparent'
            }}
            onClick={() => toggleDay(p.day)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: progress[p.day] ? '#dcfce7' : 'var(--bg-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: progress[p.day] ? '#166534' : 'var(--text-secondary)'
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.day}</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: progress[p.day] ? 500 : 600, color: 'var(--text-primary)', textDecoration: progress[p.day] ? 'line-through' : 'none' }}>
                {p.title}
              </p>
            </div>
            
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              border: progress[p.day] ? '2px solid #22c55e' : '2px solid var(--border-color)',
              background: progress[p.day] ? '#22c55e' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {progress[p.day] && <span className="material-symbols-rounded" style={{ fontSize: '1rem', color: 'white', fontVariationSettings: "'FILL' 1" }}>check</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
