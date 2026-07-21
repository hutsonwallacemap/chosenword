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
      padding: '12px 0 20px', // extra padding bottom for iOS safe area
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      zIndex: 100,
      borderTop: '1px solid var(--border-color)'
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
            fontSize: '0.75rem',
            fontWeight: isActive ? 600 : 500,
            gap: '4px',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            minWidth: '64px',
          }}>
            <div style={{
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: isActive ? 'var(--accent-blue-light)' : 'transparent',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2px'
            }}>
              <IconComponent 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                style={{
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  transition: 'color 0.3s ease'
                }}
              />
            </div>
            <span style={{ 
              opacity: isActive ? 1 : 0.8,
              transition: 'opacity 0.3s ease'
            }}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
