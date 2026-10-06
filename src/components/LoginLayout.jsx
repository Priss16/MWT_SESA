import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useData } from '../context/DataContext';
import api from '../services/api';
import {
  verifyCredentials,
  getLockStatus,
  recordFailedAttempt,
  clearAttempts,
} from '../utils/accountStore';
import { defaultStaffPassword } from '../data/accounts';

const ROLE_TAB_DEFS = [
  { role: 'admin', key: 'roleAdmin', label: 'Admin', path: '/login' },
  { role: 'principal', key: 'rolePrincipal', label: 'Principal', path: '/login/principal' },
  { role: 'hod', key: 'roleHod', label: 'HOD', path: '/login/hod' },
  { role: 'staff', key: 'roleStaff', label: 'Staff', path: '/login/staff' },
  { role: 'student', key: 'roleStudent', label: 'Student', path: '/login/student' },
];

export default function LoginLayout({
  role,
  headline,
  subheadline,
  tagline,
  fieldLabel,
  fieldPlaceholder,
  showNameField = false,
  showEmailField = false,
}) {
  const { user, login } = useAuth();
  const { t } = useSettings();
  const { addAuditLog } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const [selectedDept, setSelectedDept] = useState('CSE');
  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS'];

  const visibleTabs = role === 'student'
    ? ROLE_TAB_DEFS.filter(tab => ['admin', 'staff', 'student'].includes(tab.role))
    : ROLE_TAB_DEFS;

  const strength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        label: t('weak'),
        pct: 25,
        color: 'var(--danger)',
      };
    }

    if (score <= 2) {
      return {
        label: t('medium'),
        pct: 60,
        color: 'var(--warning)',
      };
    }

    return {
      label: t('strong'),
      pct: 100,
      color: 'var(--success)',
    };
  }, [password, t]);

  useEffect(() => {
    if (user) {
      navigate(
        user.mustChangePassword
          ? '/staff/settings'
          : `/${user.role}/dashboard`,
        { replace: true }
      );
    }
  }, [user, navigate]);

  useEffect(() => {
    if (role === 'hod') {
      setIdentifier(`hod_${selectedDept.toLowerCase()}`);
    }
  }, [role, selectedDept]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      (showNameField && !name) ||
      (showEmailField && !email) ||
      !identifier ||
      !password
    ) {
      setFailedAttempts((prev) => prev + 1);
      setErrorMessage(t('pleaseFillFields'));
      return;
    }

    const lockStatus = getLockStatus(role, identifier);

    if (lockStatus.locked) {
      const seconds = Math.ceil(lockStatus.remainingMs / 1000);

      setErrorMessage(`${t('tooManyAttempts')} ${seconds}s.`);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {


      // ------------------------------------------------
      // ALL ROLES -> REAL BACKEND LOGIN
      // ------------------------------------------------
      const res = await api.post("/auth/login", { username: identifier, password, role });
      const data = res.data;

      if (!data.success) {
        const { attempts } = recordFailedAttempt(role, identifier);
        setFailedAttempts(attempts);
        setErrorMessage(
          attempts >= 5 ? t("accountLocked") : data.message || t("incorrectCredentials")
        );
        return;
      }

      clearAttempts(role, identifier);

      const mustChangePassword = false;

      login(role, data.user.username, {
        name: data.user.name || data.user.username,
        email: data.user.email,
        dept: data.user.dept || '',
        designation: data.user.designation || '',
        mustChangePassword,
        token: data.token,
      });

      addAuditLog({
        user: `${data.user.name || data.user.username} (${
          role === 'admin' ? 'Admin' : 'Staff'
        })`,
        action: 'Login',
        details: `${
          role === 'admin' ? 'Admin' : 'Staff'
        } signed in (${data.user.username})`,
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 400 || error.response?.status === 404) {
        const { attempts } = recordFailedAttempt(role, identifier);
        setFailedAttempts(attempts);
        const backendMsg = error.response?.data?.message;
        setErrorMessage(
          attempts >= 5 ? t("accountLocked") : (backendMsg || t("incorrectCredentials"))
        );
      } else {
        const errorMessage = error.response?.data?.message || 'Unable to connect to the backend. Make sure the SESA backend is running.';
        setErrorMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.post("/auth/google", { credential: response.credential });
      const data = res.data;
      
      if (!data.success) {
        throw new Error(data.message || "Google Sign-In failed.");
      }
      
      login(data.user.role, data.user.username, {
        name: data.user.name || data.user.email,
        email: data.user.email,
        token: data.token
      });

      addAuditLog({
        user: `${data.user.username} (${data.user.role})`,
        action: 'OAuth Login',
        details: `Signed in via Google OAuth (${data.user.email})`
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (window.google && document.getElementById("googleSignInDiv")) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large" }
        );
      }
    };
    initGoogle();
    const timer = setInterval(() => {
      if (window.google) {
        initGoogle();
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="login-shell">
      <div className="login-brand">
        <div className="login-seal">NEC</div>

        <h1
          style={{
            fontSize: 34,
            marginBottom: 14,
            lineHeight: 1.15,
          }}
        >
          {headline}
        </h1>

        <p style={{ opacity: 0.78, fontSize: 15 }}>
          {tagline}
        </p>
      </div>

      <div className="login-form-panel">
        <div className="login-form-card">
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div
              className="role-tabs"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)`,
                gap: 4,
                marginBottom: 24,
              }}
            >
              {visibleTabs.map((tab) => {
                const label = t(tab.key);
                const displayLabel = (label === 'rolePrincipal' || label === 'roleHod') ? tab.label : label;
                return (
                  <Link
                    key={tab.role}
                    to={tab.path}
                    style={{
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      className={
                        'role-tab' +
                        (tab.role === role ? ' active' : '')
                      }
                      style={{
                        padding: '10px 4px',
                        fontSize: 13,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayLabel}
                    </div>
                  </Link>
                );
              })}
            </div>            <h2 style={{ marginBottom: 6 }}>
              {t('welcomeBack')}
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              {subheadline}
            </p>

            {/* Demo blocks removed */}

            {showNameField && (
              <>
                <label className="field-label">
                  {t('fullName')}
                </label>

                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priss S."
                  style={{ marginBottom: 18 }}
                />
              </>
            )}

            {showEmailField && (
              <>
                <label className="field-label">
                  {t('emailAddress')}
                </label>

                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priss.s@nec.edu.in"
                  style={{ marginBottom: 18 }}
                />
              </>
            )}

            {role === 'hod' && (
              <>
                <label className="field-label">
                  {t('department') || 'Department'}
                </label>
                <select
                  className="input"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={{ marginBottom: 18, border: '1.5px solid var(--border)', borderRadius: 9, padding: '11px 14px', background: 'var(--card)' }}
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </>
            )}

            <label className="field-label">
              {fieldLabel}
            </label>
            <input
              className="input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={fieldPlaceholder}
              style={{ marginBottom: 18 }}
            />

            <label className="field-label">
              {t('password')}
            </label>

            <div
              style={{
                position: 'relative',
                marginBottom: 8,
              }}
            >
              <input
                className="input"
                type={
                  showPassword ? 'text' : 'password'
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••••"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                style={{
                  position: 'absolute',
                  right: 2,
                  top: 10,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>

            {password && (
              <>
                <div
                  className="progress-track"
                  style={{ marginBottom: 4 }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${strength.pct}%`,
                      background: strength.color,
                    }}
                  />
                </div>

                <p
                  className="muted text-sm"
                  style={{ marginBottom: 14 }}
                >
                  {t('passwordStrength')}:{' '}
                  {strength.label} ({t('passwordHint')})
                </p>
              </>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <input type="checkbox" />
                {t('rememberMe')}
              </label>

              <Link
                to="/forgot-password"
                style={{
                  fontSize: 13,
                  color: 'var(--secondary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                {t('forgotPassword')}
              </Link>
            </div>

            {errorMessage && (
              <p className="field-error">
                {errorMessage} ({failedAttempts}{' '}
                {failedAttempts > 1
                  ? t('attempts')
                  : t('attempt')}
                )
              </p>
            )}

            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: 18,
                padding: 14,
              }}
              disabled={loading}
            >
              {loading
                ? t('signingIn')
                : t('signIn')}
            </button>

              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
                  <span style={{ padding: '0 12px', fontSize: 13, color: 'var(--text-muted)' }}>OR</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
                </div>
                <div id="googleSignInDiv" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}></div>
              </div>

            <p
              style={{
                textAlign: 'center',
                marginTop: 20,
                fontSize: 13,
                color: 'var(--text-muted)',
              }}
            >
              {t('troubleSigningIn')}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}