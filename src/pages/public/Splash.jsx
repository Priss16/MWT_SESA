import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import LanguageMenu from '../../components/LanguageMenu';

// Two ways to land here, both now fully manual - no auto-timer, no
// loading bar. The person decides when to move on:
//  1. Plain site entry (no state) - "Enter Website" takes them to Home.
//  2. After logging out (navigate('/splash', { state: { from: 'logout' } }))
//     - "Continue to Login" takes them to the login page.
export default function Splash({ onFinish }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogout = location.state?.from === 'logout';

  function handleEnter() {
    if (isLogout) {
      navigate('/login');
      return;
    }
    // Boot splash (onFinish passed in): just reveal whatever route the
    // user actually landed on, don't stomp on a deep link.
    // Routed splash (visited /splash directly): navigate for real.
    if (onFinish) {
      onFinish();
    } else {
      navigate('/');
    }
  }

  return (
    <div className="splash-shell">
      <div style={{ position: 'absolute', top: 24, right: 28, zIndex: 2, display: 'flex', gap: 10 }}>
        <ThemeToggle />
        <LanguageMenu />
      </div>

      <div
        style={{
          position: 'relative', zIndex: 1, width: 88, height: 88, borderRadius: 22,
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 2px rgba(212, 169, 74, 0.75), 0 24px 48px -20px rgba(0, 0, 0, 0.55)',
          marginBottom: 4,
        }}
      >
        {/* SESA mark: a 3x3 seating grid with the assigned seat picked
            out in the accent color - this is what the app actually
            does (assigns you a specific seat), not a generic wordmark. */}
        <svg width={52} height={52} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="10" height="10" rx="3" fill="var(--primary)" />
          <rect x="15" y="2" width="10" height="10" rx="3" fill="var(--primary)" />
          <rect x="28" y="2" width="10" height="10" rx="3" fill="var(--primary)" />
          <rect x="2" y="15" width="10" height="10" rx="3" fill="var(--primary)" />
          <rect x="15" y="15" width="10" height="10" rx="3" fill="var(--accent)" />
          <rect x="28" y="15" width="10" height="10" rx="3" fill="var(--primary)" />
          <rect x="2" y="28" width="10" height="10" rx="3" fill="var(--primary)" />
          <rect x="15" y="28" width="10" height="10" rx="3" fill="var(--primary)" />
          <rect x="28" y="28" width="10" height="10" rx="3" fill="var(--primary)" />
        </svg>
      </div>

      <p style={{ position: 'relative', zIndex: 1, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.65, color: '#fff', marginBottom: 2 }}>
        National Engineering College, Kovilpatti
      </p>
      <h1 style={{ position: 'relative', zIndex: 1, fontSize: 34, color: '#fff' }}>
        {isLogout ? 'Signed Out' : 'Examination Seating Portal'}
      </h1>
      <p style={{ position: 'relative', zIndex: 1, opacity: 0.8, fontSize: 15, textAlign: 'center', maxWidth: 400, color: '#fff' }}>
        {isLogout
          ? 'You have been signed out. Your session is closed - see you again soon.'
          : 'View your hall allotment, download hall tickets, and check invigilation duties for the current semester.'}
      </p>

      {!isLogout && (
        <p
          style={{
            position: 'relative', zIndex: 1, marginTop: 18, fontSize: 12.5, color: '#fff', opacity: 0.85,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 999, padding: '6px 16px',
          }}
        >
          📌 Odd Semester 2026 · Internal Assessment II seating now published
        </p>
      )}

      <button
        type="button"
        onClick={handleEnter}
        className="btn btn-primary"
        style={{
          position: 'relative', zIndex: 1, marginTop: 26, padding: '14px 34px', fontSize: 15,
          borderRadius: 999,
        }}
      >
        {isLogout ? 'Proceed to Login →' : 'Enter Portal →'}
      </button>

      <p style={{ position: 'absolute', zIndex: 1, bottom: 40, left: 0, right: 0, textAlign: 'center', fontSize: 13, opacity: 0.6, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        Estd. 1984 · Examination Cell, NEC
      </p>
    </div>
  );
}
