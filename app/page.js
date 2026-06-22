import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Verse of the Day Card */}
      <div style={{
        background: 'var(--accent-purple-grad)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        
        <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', opacity: 0.9 }}>
          Verse of the Day
        </p>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 500, fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.4, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
        </h2>
        <p style={{ fontWeight: 800, fontSize: '1.1rem', opacity: 0.9 }}>John 3:16</p>
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
    </div>
  );
}
