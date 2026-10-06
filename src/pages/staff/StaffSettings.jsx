import { useState, useMemo } from 'react';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import Header from '../../components/Header';
import Toggle from '../../components/Toggle';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { verifyCredentials, setPassword as setAccountPassword } from '../../utils/accountStore';

export default function StaffSettings() {
  const [prefs, setPrefs] = useState({ dutyReminders: true, emailAlerts: true, smsAlerts: false, twoFactor: false });
  const { fontSize, setFontSize, t } = useSettings();
  const { user, updateUser } = useAuth();

  const SESSIONS = [
    { device: 'Chrome on Windows', location: 'Kovilpatti, Tamil Nadu', lastActive: 'Active now', current: true },
  ];

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ---------------- Change Password (Staff) ----------------
  // Every staff member starts on a default password when Admin adds
  // them (see src/data/accounts.js) - this is where they actually
  // change it, instead of that default being permanent.
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const strength = useMemo(() => {
    let score = 0;
    if (next.length >= 8) score++;
    if (/[A-Z]/.test(next)) score++;
    if (/[0-9]/.test(next)) score++;
    if (/[^A-Za-z0-9]/.test(next)) score++;
    if (score <= 1) return { label: 'Weak', pct: 25, color: 'var(--danger)' };
    if (score <= 2) return { label: 'Medium', pct: 60, color: 'var(--warning)' };
    return { label: 'Strong', pct: 100, color: 'var(--success)' };
  }, [next]);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    const hasUpper = /[A-Z]/.test(next);
    const hasNumber = /[0-9]/.test(next);
    const hasSpecial = /[^A-Za-z0-9]/.test(next);
    if (next.length < 8 || !hasUpper || !hasNumber || !hasSpecial) {
      setPwError('New password must be 8+ characters and include an uppercase letter, a number, and a special character.');
      return;
    }
    if (next !== confirm) {
      setPwError("New passwords don't match.");
      return;
    }

    try {
      const { default: api } = await import('../../services/api');
      const res = await api.post('/auth/change-password', {
        currentPassword: current,
        newPassword: next
      });
      if (res.data.success) {
        updateUser({ mustChangePassword: false });
        setCurrent('');
        setNext('');
        setConfirm('');
        setPwSuccess(true);
      } else {
        setPwError(res.data.message || 'Failed to change password');
      }
    } catch (err) {
      setPwError(err.response?.data?.message || 'Error updating password');
    }
  }

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t("settings")} subtitle={t("settings")} />
        <div className="page-body">
          {user?.mustChangePassword && (
            <div className="card callout-light" style={{ background: '#FFFBEB', border: 'none', marginBottom: 16 }}>
              <p style={{ fontWeight: 600, color: '#92400E', marginBottom: 4 }}>
                You're signed in with the default password Admin gave you.
              </p>
              <p className="text-sm">Please set a new password below before continuing.</p>
            </div>
          )}

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>{t('fontSize')}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {['sm', 'md', 'lg'].map((s) => (
                <button key={s} className={'btn ' + (fontSize === s ? 'btn-primary' : 'btn-ghost')} onClick={() => setFontSize(s)}>
                  {s === 'sm' ? t('small') : s === 'md' ? t('medium') : t('large')}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Duty Notifications</h3>
            {[
              ['dutyReminders', 'Duty reminders', 'Remind me 24 hours before each invigilation duty'],
              ['emailAlerts', 'Email alerts', 'Email me when a new duty is assigned'],
              ['smsAlerts', 'SMS alerts', 'Text me when a duty changes at short notice'],
            ].map(([key, title, desc]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{title}</p>
                  <p className="muted text-sm">{desc}</p>
                </div>
                <Toggle on={prefs[key]} onClick={() => toggle(key)} />
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Change Password</h3>
            <p className="muted text-sm" style={{ marginBottom: 16 }}>
              New staff start on a default password from Admin - change it here to something only you know.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="grid-3" style={{ marginBottom: 8, gap: 16 }}>
                <div>
                  <label className="field-label">Current Password</label>
                  <input className="input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">New Password</label>
                  <input className="input" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Confirm New Password</label>
                  <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </div>
              </div>
              {next && (
                <>
                  <div className="progress-track" style={{ marginBottom: 4 }}>
                    <div className="progress-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
                  </div>
                  <p className="muted text-sm" style={{ marginBottom: 12 }}>Password strength: {strength.label}</p>
                </>
              )}
              {pwError && <p className="field-error" style={{ marginBottom: 12 }}>{pwError}</p>}
              {pwSuccess && <p className="text-sm" style={{ color: 'var(--success)', fontWeight: 600, marginBottom: 12 }}>Password updated.</p>}
              <div style={{ textAlign: 'right' }}>
                <button className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 8 }}>Security</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 14 }}>Two-factor authentication</p>
                <p className="muted text-sm">Require an OTP in addition to your password when signing in</p>
              </div>
              <Toggle on={prefs.twoFactor} onClick={() => toggle('twoFactor')} />
            </div>
            <div style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 10 }}>Active sessions</p>
              {SESSIONS.map((s) => (
                <div key={s.device} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <div>
                    <p style={{ fontSize: 13 }}>{s.device} {s.current && <span className="badge badge-success" style={{ marginLeft: 6 }}>This device</span>}</p>
                    <p className="muted text-sm">{s.location} · {s.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
