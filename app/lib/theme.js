// Single source of truth for the colour theme.
// The class lives on <html> (set before paint by the script in layout.js),
// and a window event keeps the Header toggle and Settings page in sync.

export const THEME_EVENT = 'cw-theme-change';

export const getCurrentTheme = () => {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark-theme', isDark);
  // Clean up the class older versions of the app put on <body>
  document.body.classList.remove('dark-theme');
  try {
    localStorage.setItem('cw_theme', isDark ? 'dark' : 'light');
  } catch (e) {}
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: isDark ? 'dark' : 'light' }));
};
