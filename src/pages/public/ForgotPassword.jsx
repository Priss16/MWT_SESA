import { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, isEmailJsConfigured } from '../../config/emailjs';
import { findAccountAcrossRoles, createResetToken } from '../../utils/accountStore';

export default function ForgotPassword() {
  // ---------------- useState: STRING STATE ----------------
  const [identifier, setIdentifier] = useState('');

  // ---------------- useState: BOOLEAN STATE ----------------
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // ---------------- useState: STRING STATE (nullable) ----------------
  // Only ever populated in demo mode (no EmailJS configured), so
  // there's still a way to test the full reset flow without a real
  // inbox. Once EmailJS is configured, the link goes only to the
  // email - never shown on screen, same as a real system.
  const [demoResetPath, setDemoResetPath] = useState(null);

  // This app has no backend, so admin/staff accounts (see
  // src/utils/accountStore.js) are matched against a live directory.
  // Students self-provision on first login though, so someone who's
  // never signed in before won't have an account yet to "find" - but
  // they should still be able to use this link to set their password
  // ahead of time. So: if the identifier doesn't match an existing
  // Admin/Staff/Student account, it's treated as a brand-new Student
  // ID, and a real reset link is still created for it. Either way, a
  // one-time reset TOKEN is created - not a random password - and the
  // emailed/shown link takes the person to /reset-password, where
  // THEY choose their own new password, same as a real "forgot
  // password" flow.
  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);

    try {
      const { default: api } = await import('../../services/api');
      await api.post('/auth/forgot-password', { email: identifier });
      
      setSending(false);
      setSent(true);
      // Even without EmailJS on the frontend, the backend will generate a token
      // and in a real system send the email. Since we don't have frontend EmailJS for the 
      // backend generated token, we just tell the user to check their email.
      setDemoResetPath(null);
    } catch (err) {
      console.error('Forgot password error:', err);
      setSending(false);
      alert('Error requesting password reset. Please try again later.');
    }
  }

  return (
    <div className="login-shell">
      <div className="login-brand">
        <div className="login-seal">NEC</div>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>Forgot your<br />password?</h1>
        <p style={{ opacity: 0.8, fontSize: 15 }}>No problem. We'll send a reset link to your registered email address.</p>
      </div>
      <div className="login-form-panel">
        <div className="login-form-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: 6 }}>Reset your password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Enter the email linked to your account.</p>

          {sent ? (
            <div className="card callout-light" style={{ background: '#ECFDF5', border: 'none' }}>
              <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>Reset link sent!</p>
              <p className="text-sm">Check {identifier || 'your inbox'} for instructions.</p>
              {!isEmailJsConfigured && demoResetPath && (
                <div style={{ marginTop: 12 }}>
                  <p className="text-sm muted" style={{ marginBottom: 10 }}>
                    (Demo mode: no real email service is configured yet - see src/config/emailjs.js to send real
                    emails. Here's the link that would've been emailed:)
                  </p>
                  <Link to={demoResetPath} className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Open Reset Link
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <label className="field-label">Email, Staff ID, or Register Number</label>
              <input
                className="input"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin@nec.edu.in or 7124102CS117"
                style={{ marginBottom: 20 }}
              />

              <button className="btn btn-primary" style={{ width: '100%', padding: 14 }} disabled={sending}>
                {sending ? 'Sending…' : 'Send Reset Link'}
              </button>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/login" style={{ color: 'var(--secondary)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>← Back to Login</Link>
          </p>
        </form>
        </div>
      </div>
    </div>
  );
}
