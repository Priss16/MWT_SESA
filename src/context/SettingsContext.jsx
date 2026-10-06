import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const SettingsContext = createContext(null);

const FONT_SCALES = { sm: 0.9, md: 1, lg: 1.15 };

export function SettingsProvider({ children }) {
  // ---------------- useState: STRING STATE ----------------
  // 'en' | 'ta' - which language the shared chrome (nav, header,
  // buttons) is shown in.
  const [language, setLanguage] = useState(() => window.localStorage.getItem('sesa_lang') || 'en');

  // ---------------- useState: STRING STATE ----------------
  // 'sm' | 'md' | 'lg' - the font-size preference from Settings.
  const [fontSize, setFontSize] = useState(() => window.localStorage.getItem('sesa_font') || 'md');

  // ---------------- useState: STRING STATE ----------------
  // 'light' | 'dark' - site-wide color theme. 'dark' is the Navy +
  // Neon Cyan palette, toggled from the icon in the top nav / splash.
  const [theme, setTheme] = useState(() => window.localStorage.getItem('sesa_theme') || 'light');

  // ---------------- useEffect: ONE DEPENDENCY ----------------
  // Persists the language choice and re-runs only when `language`
  // changes (not on every render, and not when fontSize changes).
  useEffect(() => {
    window.localStorage.setItem('sesa_lang', language);
    // Setting this lets index.css switch to a Tamil-capable font
    // (Inter/Poppins have no Tamil glyphs, so without this the browser
    // silently falls back to a generic system font).
    document.documentElement.lang = language;
  }, [language]);

  // ---------------- useEffect: ONE DEPENDENCY ----------------
  // Persists font size AND applies it to the whole document via a
  // CSS zoom factor, so every page (all 47) scales together without
  // each page having to read this value individually.
  useEffect(() => {
    window.localStorage.setItem('sesa_font', fontSize);
    document.documentElement.style.zoom = FONT_SCALES[fontSize];
  }, [fontSize]);

  // ---------------- useEffect: ONE DEPENDENCY ----------------
  // Persists the theme choice and toggles the class index.css keys
  // its "html.theme-dark { ... }" color overrides off.
  useEffect(() => {
    window.localStorage.setItem('sesa_theme', theme);
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  // Small translate helper: t('dashboard') -> 'Dashboard' or 'டாஷ்போர்டு'
  function t(key) {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  }

  const value = { language, setLanguage, fontSize, setFontSize, theme, setTheme, toggleTheme, t };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// ---------------- useContext ----------------
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside a <SettingsProvider>');
  return ctx;
}
