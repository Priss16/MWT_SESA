import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/initials';

export default function StaffProfile() {
  const { t } = useSettings();
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t('myProfile')} subtitle={t('profile')} />
        <div className="page-body grid-2" style={{ alignItems: 'start' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="avatar" style={{ width: 88, height: 88, fontSize: 30, margin: '0 auto 16px' }}>
              {getInitials(user?.name, 'ST')}
            </div>
            <h3>{user?.name || 'Staff Member'}</h3>
            <p className="muted text-sm">
              {user?.designation ? (user.dept ? `${user.designation} · ${user.dept}` : user.designation) : 'Invigilator'}
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div style={{ textAlign: 'left', fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">Staff ID</span><strong>{user?.id || '—'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">Role</span><strong>{user?.label || 'Invigilator'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">{t('department')}</span><strong>{user?.dept || '—'}</strong></div>
            </div>
          </div>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 16 }}>Contact Information</h3>
              <div className="grid-2" style={{ marginBottom: 16 }}>
                <div><label className="field-label">Email</label><input className="input" defaultValue={user?.email || ''} /></div>
                <div><label className="field-label">Phone</label><input className="input" placeholder="+91 " /></div>
              </div>
              <div style={{ textAlign: 'right' }}><button className="btn btn-primary">{t('saveChanges')}</button></div>
            </div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{t('password')}</p>
                  <p className="muted text-sm">Change it any time from Settings.</p>
                </div>
                <Link to="/staff/settings"><button className="btn btn-secondary">Change Password</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
