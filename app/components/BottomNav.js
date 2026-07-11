'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Bookmark, Settings } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', Icon: Home },
    { name: 'Bible', path: '/bible', Icon: BookOpen },
    { name: 'Saved', path: '/saved', Icon: Bookmark },
    { name: 'Settings', path: '/settings', Icon: Settings },
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
        const IconComponent = item.Icon;
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
            <IconComponent 
              size={24} 
              strokeWidth={isActive ? 2.5 : 2} 
              style={{
                fill: isActive ? 'var(--accent-blue)' : 'transparent',
                fillOpacity: 0.15,
                transition: 'all 0.3s ease'
              }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
