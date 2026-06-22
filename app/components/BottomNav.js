'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Bible', path: '/bible', icon: 'menu_book' },
    { name: 'Saved', path: '/saved', icon: 'bookmark' },
  ];

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '16px 0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      zIndex: 100
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link href={item.path} key={item.name} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: isActive ? 700 : 500,
            gap: '6px',
            transition: 'all 0.3s ease',
            transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
          }}>
            <span className="material-symbols-rounded" style={{ 
              fontSize: isActive ? '1.8rem' : '1.6rem',
              fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              transition: 'all 0.3s ease'
            }}>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
