import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { verifyCredentials } from '../utils/accountStore';
import { useIdleTimer } from '../utils/useIdleTimer';
import { useSettings } from '../context/SettingsContext';

const IDLE_MINUTES = 15;
const WARNING_SECONDS = 60;

// Mounted once near the app root (see main.jsx). Renders nothing while
// the person is active. After IDLE_MINUTES of no mouse/keyboard/touch
// activity, it locks the screen behind a password prompt instead of
// silently staying signed in forever - the actual gap being fixed
// here, since this app previously had no session timeout at all.
//
// The last WARNING_SECONDS of that countdown show a "still there?"
// modal first, so normal reading/thinking time doesn't lock someone
// out mid-task with no notice.
export default function IdleGuard() {
  const { t } = useSettings();
  const { user, logout } = useAuth();
  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState('');
  const [unlockError, setUnlockError] = useState(null);

  const handleIdle = useCallback(() => {
    setLocked(true);
  }, []);

  const { warning, remainingMs, stayActive } = useIdleTimer({
    enabled: !!user && !locked,
    idleMs: IDLE_MINUTES * 60 * 1000,
    warningMs: WARNING_SECONDS * 1000,
    onIdle: handleIdle,
  });

  async function handleUnlock(e) {
    e.preventDefault();
    try {
      const api = await import('../services/api').then(m => m.default);
      const res = await api.post("/auth/login", { username: user.username || user.id, password, role: user.role });
      
      if (res.data.success) {
        setPassword('');
        setUnlockError(null);
        setLocked(false);
        stayActive();
      } else {
        setUnlockError(res.data.message || 'That password is incorrect. Try again.');
      }
    } catch (error) {
      console.error(error);
      setUnlockError(error.response?.data?.message || 'That password is incorrect. Try again.');
    }
  }

  function handleFullLogout() {
    setLocked(false);
    setPassword('');
    setUnlockError(null);
    logout();
  }

  if (!user) return null;

  // ---------------- Lock screen ----------------
  if (locked) {
    return (
      <div style={overlayStyle}>
        <form onSubmit={handleUnlock} className="card" style={{ maxWidth: 380, width: '90%', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Session locked</h2>
          <p className="muted text-sm" style={{ marginBottom: 20 }}>
            You were signed in as <strong>{user.name}</strong> but inactive for {IDLE_MINUTES} minutes.
            Enter your password to keep going.
          </p>
          <input
            type="password"
            className="input"
            placeholder={t('password')}
            value={password}
            autoFocus
            onChange={(e) => { setPassword(e.target.value); setUnlockError(null); }}
            style={{ marginBottom: 10 }}
          />
          {unlockError && <p className="text-sm" style={{ color: 'var(--danger, #DC2626)', marginBottom: 10 }}>{unlockError}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 10 }}>Unlock</button>
          <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={handleFullLogout}>
            Log out instead
          </button>
        </form>
      </div>
    );
  }

  // ---------------- Countdown warning, shown just before locking ----------------
  if (warning) {
    const seconds = Math.ceil(remainingMs / 1000);
    return (
      <div style={overlayStyle}>
        <div className="card" style={{ maxWidth: 380, width: '90%', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Still there?</h2>
          <p className="muted text-sm" style={{ marginBottom: 20 }}>
            You'll be signed out due to inactivity in <strong>{seconds}s</strong>.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={stayActive}>
            Stay signed in
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};
