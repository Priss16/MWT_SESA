import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { peekResetToken, redeemResetToken } from '../../utils/accountStore';
import { useSettings } from '../../context/SettingsContext';

const ROLE_LOGIN_PATH = { admin: '/login', staff: '/login/staff', student: '/login/student' };
const ROLE_LABEL = { admin: 'Admin', staff: 'Staff', student: 'Student' };

export default function ResetPassword() {
  const { t } = useSettings();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status] = useState({ valid: true, role: 'student', id: 'Account' });

  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [done, setDone] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();

    const hasUpper = /[A-Z]/.test(next);
    const hasNumber = /[0-9]/.test(next);
    const hasSpecial = /[^A-Za-z0-9]/.test(next);
    if (next.length < 8 || !hasUpper || !hasNumber || !hasSpecial) {
      setErrorMessage('Password must be 8+ characters and include an uppercase letter, a number, and a special character.');
      return;
    }
    if (next !== confirm) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    try {
      const { default: api } = await import('../../services/api');
      const res = await api.post('/auth/reset-password', {
        token: token,
        newPassword: next
      });
      if (res.data.success) {
        setErrorMessage(null);
        setDone(true);
      } else {
        setErrorMessage(res.data.message || 'This reset link is no longer valid. Please request a new one.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error resetting password');
    }
  }

  if (!status.valid) {
    const message = 'This reset link is invalid or expired.';
    return (
      <div className="login-shell">
        <div className="login-brand">
          <div className="login-seal">NEC</div>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>That link<br />isn't valid.</h1>
          <p style={{ opacity: 0.8, fontSize: 15 }}>Reset links expire after 30 minutes and can only be used once.</p>
        </div>
        <div className="login-form-panel">
          <div className="login-form-card">
            <div className="card callout-light" style={{ background: '#FEF2F2', border: 'none' }}>
              <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: 8 }}>{message}</p>
              <p className="text-sm">Request a new one from the Forgot Password page.</p>
            </div>
            <p style={{ textAlign: 'center', marginTop: 20 }}>
              <Link to="/forgot-password" style={{ color: 'var(--secondary)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                ← Back to Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="login-shell">
        <div className="login-brand">
          <div className="login-seal">NEC</div>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>{t('password')}<br />updated!</h1>
          <p style={{ opacity: 0.8, fontSize: 15 }}>You can now sign in with your new password.</p>
        </div>
        <div className="login-form-panel">
          <div className="login-form-card">
            <div className="card callout-light" style={{ background: '#ECFDF5', border: 'none', marginBottom: 20 }}>
              <p style={{ color: 'var(--success)', fontWeight: 600 }}>Your password has been reset.</p>
            </div>
            <Link
              to={ROLE_LOGIN_PATH[status.role] || '/login'}
              className="btn btn-primary"
              style={{ display: 'block', textAlign: 'center', padding: 14, textDecoration: 'none' }}
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-brand">
        <div className="login-seal">NEC</div>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>Set a new<br />password.</h1>
        <p style={{ opacity: 0.8, fontSize: 15 }}>Choose a new password for your account.</p>
      </div>
      <div className="login-form-panel">
        <div className="login-form-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: 6 }}>Set new password</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Resetting the {ROLE_LABEL[status.role] || ''} account for <strong>{status.id}</strong>.
            </p>

            <label className="field-label">New Password</label>
            <input
              className="input"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            {next && (
              <>
                <div className="progress-track" style={{ marginBottom: 4 }}>
                  <div className="progress-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
                </div>
                <p className="muted text-sm" style={{ marginBottom: 14 }}>
                  Password strength: {strength.label} (8+ chars, a capital letter, a number, a special character)
                </p>
              </>
            )}

            <label className="field-label">Confirm New Password</label>
            <input
              className="input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ marginBottom: 20 }}
            />

            {errorMessage && <p className="field-error">{errorMessage}</p>}

            <button className="btn btn-primary" style={{ width: '100%', padding: 14 }}>Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
