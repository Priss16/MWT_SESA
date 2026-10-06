import { Link } from 'react-router-dom';
import StudentNav from '../../components/StudentNav';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/initials';
import { useSettings } from '../../context/SettingsContext';

export default function StudentProfile() {
  const { t } = useSettings();
  const { user } = useAuth();
  return (
    <div>
      <StudentNav />
      <div className="page-body grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="avatar" style={{ width: 88, height: 88, fontSize: 30, margin: '0 auto 16px' }}>{getInitials(user?.name, 'ST')}</div>
          <h3>{user?.name || 'Priss S.'}</h3>
          <p className="muted text-sm">{user?.dept ? `B.E. ${user.dept}` : 'Computer Science & Engineering'}</p>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
          <div style={{ textAlign: 'left', fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">{t('registerNumber')}</span><strong>{user?.id || '7124102CS117'}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">Year</span><strong>{user?.year || 'III'}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">{t('semester')}</span><strong>{user?.semester || 'V'}</strong></div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Contact Information</h3>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div><label className="field-label">Email</label><input className="input" defaultValue={user?.email || 'priss.s@nec.edu.in'} /></div>
              <div><label className="field-label">Phone</label><input className="input" defaultValue="+91 98765 12345" /></div>
            </div>
            <div style={{ textAlign: 'right' }}><button className="btn btn-primary">{t('saveChanges')}</button></div>
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 14 }}>{t('password')}</p>
                <p className="muted text-sm">Last changed 4 months ago</p>
              </div>
              <Link to="/student/change-password"><button className="btn btn-secondary">Change Password</button></Link>
            </div>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 14 }}>Preferences</p>
                <p className="muted text-sm">Language, font size, and notification settings</p>
              </div>
              <Link to="/student/settings"><button className="btn btn-secondary">⚙ Open Settings</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
