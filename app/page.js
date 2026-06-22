import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        backgroundColor: 'var(--accent-gold-light)',
        border: '1px solid var(--accent-gold)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <p style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Verse of the Day
        </p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 500, fontStyle: 'italic', marginBottom: '16px', color: 'var(--text-primary)' }}>
          "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
        </h2>
        <p style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>John 3:16</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link href="/bible" style={{
          backgroundColor: 'var(--bg-card)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: 'var(--accent-blue)' }}>auto_stories</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Read Bible</h3>
        </Link>
        <Link href="/saved" style={{
          backgroundColor: 'var(--bg-card)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '2rem', color: 'var(--accent-blue)' }}>bookmark</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Saved Items</h3>
        </Link>
      </div>
    </div>
  );
}
