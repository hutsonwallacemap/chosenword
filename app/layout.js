import './globals.css';

export const metadata = {
  title: 'Chosen Word',
  description: 'A modern, beautiful, and offline-ready Bible application.',
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
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
