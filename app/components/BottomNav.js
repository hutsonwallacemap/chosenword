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
    <nav style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: 'var(--bg-card)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      borderTop: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
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
            fontSize: '0.75rem',
            fontWeight: isActive ? 600 : 500,
            gap: '4px'
          }}>
            <span className="material-symbols-rounded" style={{ 
              fontSize: '1.5rem',
              fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" 
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
