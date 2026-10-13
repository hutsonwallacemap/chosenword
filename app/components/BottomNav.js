'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap, Bookmark, NotebookPen } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', Icon: Home },
    { name: 'Bible', path: '/bible', Icon: BookOpen },
    // Dictionary, Calendar and Maps are opened from the Study hub
    { name: 'Study', path: '/study', Icon: GraduationCap, also: ['/dictionary', '/calendar', '/places'] },
    { name: 'Saved', path: '/saved', Icon: Bookmark },
    // Settings moved to the header gear so the bar stays at five tabs
    { name: 'Sermons', path: '/sermons', Icon: NotebookPen, also: ['/sermons/'] },
  ];

  return (
    <nav className="glass-panel" aria-label="Main" style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      // Clears the home indicator on notched phones (needs viewportFit: 'cover' in layout.js)
      padding: '10px 0 calc(10px + env(safe-area-inset-bottom))',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      zIndex: 100,
      borderTop: '1px solid var(--border-color)'
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.also || []).some(p => pathname.startsWith(p));
        const IconComponent = item.Icon;
        return (
          <Link href={item.path} key={item.name} aria-current={isActive ? 'page' : undefined} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.75rem',
            fontWeight: isActive ? 600 : 500,
            gap: '3px',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            minWidth: '56px',
            minHeight: '44px',
          }}>
            <div style={{
              padding: '4px 12px',
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
                aria-hidden="true"
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
