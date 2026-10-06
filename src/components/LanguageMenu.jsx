import { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'ta', label: 'தமிழ்' },
  { key: 'hi', label: 'हिन्दी' },
];

/**
 * Globe icon + dropdown, dropped into every top nav (Header,
 * StudentNav, PublicNav) so language is a single icon everywhere
 * instead of a control repeated inside every Settings page.
 */
export default function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useSettings();
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button className="icon-btn" onClick={() => setOpen((prev) => !prev)} title={t('language')} type="button">
        🌐
      </button>

      {open && (
        <div className="card prefs-panel" style={{ width: 160, padding: 8 }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              type="button"
              onClick={() => { setLanguage(lang.key); setOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8,
                border: 'none', background: language === lang.key ? 'var(--bg)' : 'transparent',
                color: language === lang.key ? 'var(--primary)' : 'var(--text)',
                fontWeight: language === lang.key ? 600 : 500, fontSize: 13, cursor: 'pointer',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
