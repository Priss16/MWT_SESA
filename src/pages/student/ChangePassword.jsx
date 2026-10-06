import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNav from '../../components/StudentNav';
import { useAuth } from '../../context/AuthContext';
import { verifyCredentials, setPassword as setAccountPassword } from '../../utils/accountStore';
import { useSettings } from '../../context/SettingsContext';

export default function ChangePassword() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  // useMemo: recompute strength only when the new password itself changes
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

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null);

    // Actually check the current password against what's on file,
    // instead of accepting anything typed in.
    const result = verifyCredentials('student', user?.id, current);
    if (!result.ok) {
      setErrorMessage('Current password is incorrect.');
      return;
    }

    const hasUpper = /[A-Z]/.test(next);
    const hasNumber = /[0-9]/.test(next);
    const hasSpecial = /[^A-Za-z0-9]/.test(next);
    if (next.length < 8 || !hasUpper || !hasNumber || !hasSpecial) {
      setErrorMessage('New password must be 8+ characters and include an uppercase letter, a number, and a special character.');
      return;
    }
    if (next !== confirm) {
      setErrorMessage("New passwords don't match.");
      return;
    }

    // Actually persist the new password, instead of just navigating away.
    setAccountPassword('student', user?.id, next);
    setSuccess(true);
  }

  if (success) {
    return (
      <div>
        <StudentNav />
        <div className="page-body">
          <div className="card callout-light" style={{ background: '#ECFDF5', border: 'none', maxWidth: 520 }}>
            <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: 8 }}>Password updated!</p>
            <p className="text-sm" style={{ marginBottom: 16 }}>Use your new password the next time you sign in.</p>
            <button className="btn btn-primary" onClick={() => navigate('/student/profile')}>Back to Profile</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudentNav />
      <div className="page-body grid-2" style={{ alignItems: 'start' }}>
        <form className="card" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: 22, marginBottom: 20 }}>Change Password</h2>
          <label className="field-label">Current Password *</label>
          <input className="input" type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} style={{ marginBottom: 18 }} />

          <label className="field-label">New Password *</label>
          <input className="input" type="password" required value={next} onChange={(e) => setNext(e.target.value)} style={{ marginBottom: 8 }} />
          {next && (
            <>
              <div className="progress-track" style={{ marginBottom: 4 }}>
                <div className="progress-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
              </div>
              <p className="muted text-sm" style={{ marginBottom: 18 }}>Password strength: {strength.label}</p>
            </>
          )}

          <label className="field-label">Confirm New Password *</label>
          <input className="input" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ marginBottom: 20 }} />

          <div className="card" style={{ background: '#F8FAFC', marginBottom: 20 }}>
            <p className="muted text-sm">Password must be at least 8 characters and include a number and an uppercase letter.</p>
          </div>

          {errorMessage && <p className="field-error" style={{ marginBottom: 12 }}>{errorMessage}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/student/profile')}>{t('cancel')}</button>
            <button className="btn btn-primary">{t('update')}</button>
          </div>
        </form>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Keeping your account secure</h3>
          <p className="text-sm">• Don't reuse passwords from other sites.</p>
          <p className="text-sm">• Avoid using your register number or name.</p>
          <p className="text-sm">• You'll be signed out of other devices after changing your password.</p>
          <p className="text-sm">• Contact the Exam Cell if you notice any unfamiliar activity.</p>
        </div>
      </div>
    </div>
  );
}
