import { useSettings } from '../context/SettingsContext';

/**
 * Single-click icon toggle between the light theme and the Navy +
 * Neon Cyan dark theme (index.css: html.theme-dark). Dropped into
 * every top nav next to LanguageMenu, and onto the Splash/landing
 * page so the choice can be made before even entering the site.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useSettings();
  const isDark = theme === 'dark';

  return (
    <button
      className="icon-btn"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      type="button"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
