import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import PreferencesMenu from './PreferencesMenu';
import LanguageMenu from './LanguageMenu';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { to: '/', key: 'home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicNav() {
  const location = useLocation();
  const { t } = useSettings();

  return (
    <header className="public-header">
      <div className="logo">
        <div className="logo-badge" style={{ background: 'var(--primary)', color: '#fff' }}>S</div>
        <h2 style={{ fontSize: 18 }}>SESA</h2>
      </div>
      <nav>
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active-link' : ''}
          >
            {link.key ? t(link.key) : link.label}
          </Link>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />
        <LanguageMenu />
        <PreferencesMenu />
        <Link to="/login">
          <button className="btn btn-primary">{t('login')}</button>
        </Link>
      </div>
    </header>
  );
}
