'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { nt30Plan, plan180, plan365 } from '../data/readingPlans';

export default function PlansPage() {
  const router = useRouter();
  
  // Available plans
  const plans = [
    { id: '30day', name: '30 Days', desc: 'New Testament Intro', data: nt30Plan, total: 30 },
    { id: '6month', name: '6 Months', desc: 'Accelerated Journey', data: plan180, total: 180 },
    { id: '1year', name: '1 Year', desc: 'Complete Bible', data: plan365, total: 365 }
  ];

  const [activePlanId, setActivePlanId] = useState('30day');
  const [allProgress, setAllProgress] = useState({
    '30day': {},
    '6month': {},
    '1year': {}
  });

  useEffect(() => {
    setAllProgress({
      '30day': JSON.parse(localStorage.getItem('cw_plan_30day')) || {},
      '6month': JSON.parse(localStorage.getItem('cw_plan_6month')) || {},
      '1year': JSON.parse(localStorage.getItem('cw_plan_1year')) || {}
    });
  }, []);

  const activePlan = plans.find(p => p.id === activePlanId);
  const activeProgress = allProgress[activePlanId] || {};

  const toggleDay = (day) => {
    const newProgress = { ...activeProgress, [day]: !activeProgress[day] };
    
    setAllProgress(prev => ({
      ...prev,
      [activePlanId]: newProgress
    }));
    
    localStorage.setItem(`cw_plan_${activePlanId}`, JSON.stringify(newProgress));
  };

  const completedCount = Object.values(activeProgress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / activePlan.total) * 100);

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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
        {plans.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePlanId(p.id)}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activePlanId === p.id ? 'var(--text-primary)' : 'var(--bg-secondary)',
              color: activePlanId === p.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--accent-blue-light), var(--bg-secondary))', border: '1px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>{activePlan.desc}</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>{activePlan.name} Plan</h2>
          </div>
          <span className="material-symbols-rounded" style={{ fontSize: '2.5rem', color: 'var(--accent-blue)' }}>library_books</span>
        </div>
        
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{completedCount} of {activePlan.total} Days</span>
          <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{progressPercent}%</span>
        </div>
        
        <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-blue)', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)', paddingLeft: '8px', marginBottom: '8px' }}>Daily Schedule</h3>
        
        {activePlan.data.map((p) => (
          <div 
            key={p.day}
            className="card"
            style={{ 
              padding: '16px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              opacity: activeProgress[p.day] ? 0.6 : 1,
              transition: 'all 0.2s',
              borderLeft: activeProgress[p.day] ? '4px solid #22c55e' : '4px solid transparent'
            }}
            onClick={() => toggleDay(p.day)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: activeProgress[p.day] ? '#dcfce7' : 'var(--bg-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: activeProgress[p.day] ? '#166534' : 'var(--text-secondary)'
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.day}</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: activeProgress[p.day] ? 500 : 600, color: 'var(--text-primary)', textDecoration: activeProgress[p.day] ? 'line-through' : 'none' }}>
                {p.title}
              </p>
            </div>
            
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              border: activeProgress[p.day] ? '2px solid #22c55e' : '2px solid var(--border-color)',
              background: activeProgress[p.day] ? '#22c55e' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeProgress[p.day] && <span className="material-symbols-rounded" style={{ fontSize: '1rem', color: 'white', fontVariationSettings: "'FILL' 1" }}>check</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
