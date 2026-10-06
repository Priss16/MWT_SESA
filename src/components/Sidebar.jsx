import T from '@/components/T';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

// Link lists reference translation KEYS, not hardcoded English text -
// the actual label is resolved at render time via t(key), so switching
// language in Preferences instantly relabels every nav item.
export const ADMIN_LINK_KEYS = [
  { to: '/admin/dashboard', key: 'dashboard' },
  { to: '/admin/students', key: 'students' },
  { to: '/admin/staff', key: 'staff' },
  { to: '/admin/departments', key: 'departments' },
  { to: '/admin/subjects', key: 'subjects' },
  { to: '/admin/exams', key: 'exams' },
  { to: '/admin/halls', key: 'halls' },
  { to: '/admin/hall-plan', key: 'hallPlan' },
  { to: '/admin/invigilators', key: 'invigilators' },
  { to: '/admin/notifications', key: 'notifications' },
  { to: '/admin/audit-logs', key: 'auditLogs' },
];

export const ADMIN_BOTTOM_LINK_KEYS = [
  { to: '/admin/settings', key: 'settings' },
];

export const PRINCIPAL_LINK_KEYS = [
  { to: '/principal/dashboard', key: 'dashboard' },
  { to: '/principal/departments', key: 'departments' },
  { to: '/principal/exams', key: 'exams' },
  { to: '/principal/halls', key: 'halls' },
  { to: '/principal/invigilation', key: 'invigilation' },
  { to: '/principal/substitution-requests', key: 'substitutionRequests' },
];

export const HOD_LINK_KEYS = [
  { to: '/hod/dashboard', key: 'dashboard' },
  { to: '/hod/exams', key: 'exams' },
  { to: '/hod/halls', key: 'halls' },
  { to: '/hod/staff', key: 'staff' },
  { to: '/hod/invigilation', key: 'invigilation' },
  { to: '/hod/substitution-requests', key: 'substitutionRequests' },
];

export const STAFF_LINK_KEYS = [
  { to: '/staff/dashboard', key: 'dashboard' },
  { to: '/staff/halls', key: 'assignedHalls' },
  { to: '/staff/students', key: 'studentList' },
  { to: '/staff/invigilation', key: 'myInvigilation' },
  { to: '/staff/substitution-requests', key: 'myRequests' },
  { to: '/staff/notifications', key: 'notifications' },
  { to: '/staff/profile', key: 'profile' },
];

export const STAFF_BOTTOM_LINK_KEYS = [
  { to: '/staff/settings', key: 'settings' },
];

// Kept for backwards compatibility with any page still importing the
// old English-only names.
export const ADMIN_LINKS = ADMIN_LINK_KEYS.map((l) => ({ to: l.to, label: l.key }));
export const STAFF_LINKS = STAFF_LINK_KEYS.map((l) => ({ to: l.to, label: l.key }));
export const PRINCIPAL_LINKS = PRINCIPAL_LINK_KEYS.map((l) => ({ to: l.to, label: l.key }));
export const HOD_LINKS = HOD_LINK_KEYS.map((l) => ({ to: l.to, label: l.key }));

export const PRINCIPAL_BOTTOM_LINK_KEYS = [
  { to: '/principal/settings', key: 'settings' },
];

export const HOD_BOTTOM_LINK_KEYS = [
  { to: '/hod/settings', key: 'settings' },
];

export default function Sidebar({ links = ADMIN_LINK_KEYS, bottomLinks = null }) {
  const { logout } = useAuth();
  const { t } = useSettings();
  const navigate = useNavigate();

  let finalBottomLinks = bottomLinks;
  if (!bottomLinks || (Array.isArray(bottomLinks) && bottomLinks.length === 0)) {
    const firstLink = (links && links[0]) ? links[0].to : '';
    if (firstLink.startsWith('/admin')) finalBottomLinks = ADMIN_BOTTOM_LINK_KEYS;
    else if (firstLink.startsWith('/staff')) finalBottomLinks = STAFF_BOTTOM_LINK_KEYS;
    else if (firstLink.startsWith('/principal')) finalBottomLinks = PRINCIPAL_BOTTOM_LINK_KEYS;
    else if (firstLink.startsWith('/hod')) finalBottomLinks = HOD_BOTTOM_LINK_KEYS;
    else finalBottomLinks = [];
  }

  // Logging out drops the user on the splash screen for a minute
  // before it hands them off to the login page.
  function handleLogout() {
    logout();
    navigate('/splash', { state: { from: 'logout' } });
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-badge">S</div>
        <strong>SESA</strong>
      </div>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          >
            {t(link.key)}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 40 }}>
        <nav>
          {finalBottomLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
            >
              {link.key === 'settings' ? '⚙ ' : ''}{t(link.key)}
            </NavLink>
          ))}
          <button className="nav-item logout-item" onClick={handleLogout} type="button">
            ⏻ {t('logout')}
          </button>
        </nav>
      </div>
    </aside>
  );
}
