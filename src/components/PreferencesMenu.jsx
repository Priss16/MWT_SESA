import { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const SIZES = [
  { key: 'sm', label: 'A-' },
  { key: 'md', label: 'A' },
  { key: 'lg', label: 'A+' },
];

/**
 * Font-size icon + dropdown, dropped into every top nav (Header,
 * StudentNav, PublicNav) alongside LanguageMenu and ThemeToggle.
 */
export default function PreferencesMenu() {
  // ---------------- useState: BOOLEAN STATE ----------------
  const [open, setOpen] = useState(false);
  const { fontSize, setFontSize, t } = useSettings();

  // ---------------- useRef ----------------
  // Reference to the wrapping <div> so we can detect "click outside"
  // and close the dropdown, without storing that in state (a ref
  // doesn't need to trigger a re-render on its own).
  const wrapperRef = useRef(null);

  // ---------------- useEffect: ONE DEPENDENCY ----------------
  // Attaches/removes the outside-click listener only when `open`
  // changes, not on every render.
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
      <button className="icon-btn" onClick={() => setOpen((prev) => !prev)} title={t('fontSize')} type="button">
        A
      </button>

      {open && (
        <div className="card prefs-panel">
          <p className="muted text-sm" style={{ fontWeight: 600, marginBottom: 10 }}>{t('fontSize')}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={'btn ' + (fontSize === s.key ? 'btn-primary' : 'btn-ghost')}
                style={{ flex: 1, padding: '6px 0', fontSize: 12 }}
                onClick={() => setFontSize(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
