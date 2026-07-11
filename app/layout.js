import './globals.css';

export const metadata = {
  title: 'Chosen Word',
  description: 'A modern, beautiful, and offline-ready Bible application.',
  manifest: '/manifest.json',
};

import Header from './components/Header';
import BottomNav from './components/BottomNav';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('cw_theme');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark-theme');
              }
              const fontSize = localStorage.getItem('cw_font_size');
              if (fontSize) {
                document.documentElement.classList.add('font-' + fontSize);
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body>
        <Header />
        <main style={{ padding: '24px 20px', minHeight: 'calc(100vh - 160px)' }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
