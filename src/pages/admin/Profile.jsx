import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { t } = useSettings();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: 'arun.j@nec.edu.in', phone: '+91 90000 12345' });
  const initials = form.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('myProfile')} subtitle={t('profile')} />
        <div className="page-body grid-2" style={{ alignItems: 'start' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="avatar" style={{ width: 88, height: 88, fontSize: 30, margin: '0 auto 16px' }}>{initials}</div>
            <h3>{form.name}</h3>
            <p className="muted text-sm">{user?.label}</p>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div style={{ textAlign: 'left', fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">Staff ID</span><strong>STF-1001</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span className="muted">Role</span><strong>Super Admin</strong></div>
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 16 }}>Personal Information</h3>
              <div className="grid-2" style={{ marginBottom: 16 }}>
                <div><label className="field-label">Full Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="field-label">Email</label><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="grid-2" style={{ marginBottom: 16 }}>
                <div><label className="field-label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div style={{ textAlign: 'right' }}><button className="btn btn-primary">{t('saveChanges')}</button></div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Security</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{t('password')}</p>
                  <p className="muted text-sm">Last changed 3 months ago</p>
                </div>
                <button className="btn btn-secondary">Change Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
