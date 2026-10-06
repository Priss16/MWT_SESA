import T from '@/components/T';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import PreferencesMenu from './PreferencesMenu';
import LanguageMenu from './LanguageMenu';
import ThemeToggle from './ThemeToggle';

export default function Header({ title, subtitle }) {
  // ---------------- useState: BOOLEAN STATE ----------------
  const [showNotifications, setShowNotifications] = useState(false);

  // ---------------- useContext (via useAuth) ----------------
  const { user, logout } = useAuth();

  // ---------------- useContext (via useSettings) ----------------
  const { t } = useSettings();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/splash', { state: { from: 'logout' } });
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
    : '?';

  // Header.jsx is shared by Admin and Staff pages, so the profile
  // link has to point at whichever role is actually logged in.
  const profilePath = user?.role === 'staff' ? '/staff/profile' : '/admin/profile';

  return (
    <header className="header">
      <div>
        {subtitle && <span className="subtitle">{subtitle}</span>}
        <h2 className="title">{title}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
        <ThemeToggle />
        <LanguageMenu />
        <PreferencesMenu />
        <button className="bell" onClick={() => setShowNotifications((prev) => !prev)}>
          <span className="dot" />
          🔔
        </button>

        {showNotifications && (
          <div className="card" style={{ position: 'absolute', top: 46, right: 190, width: 260, padding: 16, zIndex: 10 }}>
            <strong style={{ fontSize: 13 }}>{t('notifications')}</strong>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              2 invigilators unassigned for EC302.
            </p>
          </div>
        )}

        <Link to={profilePath} className="user-chip" style={{ textDecoration: 'none', color: 'inherit' }} title={t('profile')}>
          <div className="avatar">{initials}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div className="user-label" style={{ fontSize: 11 }}>{user?.label}</div>
          </div>
        </Link>

        <button className="logout-btn" onClick={handleLogout} type="button">{t('logout')}</button>
      </div>
    </header>
  );
}
