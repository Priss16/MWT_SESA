import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import PreferencesMenu from './PreferencesMenu';
import LanguageMenu from './LanguageMenu';
import ThemeToggle from './ThemeToggle';

// Same nav-key pattern as the Admin/Staff Sidebar - every Student page
// (Dashboard, Search Hall, Exam Schedule, Notifications, Profile,
// Change Password, Hall Slip, Download Hall Slip, Hall Search Result)
// renders THIS exact component, so the top-middle menu is guaranteed
// to look and behave identically no matter which student page you're
// on - which is the consistency that was missing before.
const LINKS = [
  { to: '/student/dashboard', key: 'dashboard' },
  { to: '/student/search-hall', key: 'searchHall' },
  { to: '/student/exam-schedule', key: 'examSchedule' },
  { to: '/student/notifications', key: 'notifications' },
];

export default function StudentNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useSettings();
  const initials = user?.name ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('') : '?';

  // Logging out drops the student on the splash screen for a minute
  // before it hands them off to the login page.
  function handleLogout() {
    logout();
    navigate('/splash', { state: { from: 'logout' } });
  }

  return (
    <header className="student-header">
      <Link to="/student/dashboard" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div className="logo-badge">S</div>
        <h2 style={{ fontSize: 17 }}>SESA</h2>
      </Link>

      <nav>
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to} className={location.pathname === link.to ? 'active-link' : ''}>
            {t(link.key)}
          </Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />
        <LanguageMenu />
        <PreferencesMenu />
        <Link to="/student/profile" className="user-chip" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }} title={t('profile')}>
          <div className="avatar">{initials}</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.name || 'Student'}</span>
            <span className="user-label" style={{ fontSize: 11 }}>{user?.label}</span>
          </div>
        </Link>
        <button className="logout-btn" onClick={handleLogout} type="button">{t('logout')}</button>
      </div>
    </header>
  );
}
