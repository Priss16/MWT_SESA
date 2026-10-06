import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { getPasswordStrength } from '../../utils/passwordStrength';
import { getLockStatus, recordFailedAttempt, clearAttempts } from '../../utils/accountStore';
import api from '../../services/api';

const ROLE_TAB_DEFS = [
  { role: 'admin', key: 'roleAdmin', label: 'Admin', path: '/login' },
  { role: 'principal', key: 'rolePrincipal', label: 'Principal', path: '/login/principal' },
  { role: 'hod', key: 'roleHod', label: 'HOD', path: '/login/hod' },
  { role: 'staff', key: 'roleStaff', label: 'Staff', path: '/login/staff' },
  { role: 'student', key: 'roleStudent', label: 'Student', path: '/login/student' },
];

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS'];
const YEARS = ['I', 'II', 'III', 'IV'];
const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function LoginStudent() {
  const { user, login } = useAuth();
  const { addAuditLog } = useData();
  const { t } = useSettings();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // ---------------- useState: STRING STATE ----------------
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  // ---------------- useState: BOOLEAN STATE ----------------
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- useState: OBJECT STATE (nullable) ----------------
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!regNo || !password || !confirmPassword || !name || !dept || !year || !semester) {
        setErrorMessage(t('pleaseFillFields'));
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
      
      const hasUpper = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      if (password.length < 8 || !hasUpper || !hasNumber || !hasSpecial) {
        setErrorMessage(t('passwordPolicyError'));
        return;
      }

      setLoading(true);
      try {
        const res = await api.post("/auth/register-student", {
          regNo, name, email, department: dept, year, semester, password
        });
        
        if (res.data.success) {
          login('student', res.data.user.username, { 
            name: res.data.user.name || name, 
            email: email, 
            token: res.data.token
          });
          addAuditLog({
            user: `${name} (Student)`,
            action: 'Register & Login',
            details: `Student registered and signed in (${regNo})`,
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrorMessage(error.response?.data?.message || 'Unable to register.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // LOGIN MODE
    if (!regNo || !password) {
      setFailedAttempts((prev) => prev + 1);
      setErrorMessage(t('pleaseFillFields'));
      return;
    }

    const lockStatus = getLockStatus('student', regNo);
    if (lockStatus.locked) {
      const seconds = Math.ceil(lockStatus.remainingMs / 1000);
      setErrorMessage(`${t('tooManyAttempts')} ${seconds}s.`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username: regNo, password, role: 'student' });
      const data = res.data;

      if (!data.success) {
        const { attempts } = recordFailedAttempt('student', regNo);
        setFailedAttempts(attempts);
        setErrorMessage(attempts >= 5 ? t('accountLocked') : data.message || t('incorrectRegNoOrPassword'));
        setLoading(false);
        return;
      }

      clearAttempts('student', regNo);
      
      login('student', data.user.username, { 
        name: data.user.name || data.user.username, 
        email: data.user.email, 
        token: data.token
      });

      addAuditLog({
        user: `${data.user.name || regNo} (Student)`,
        action: 'Login',
        details: `Student signed in (${regNo})`,
      });

    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401 || error.response?.status === 400 || error.response?.status === 404) {
        const { attempts } = recordFailedAttempt('student', regNo);
        setFailedAttempts(attempts);
        const backendMsg = error.response?.data?.message;
        setErrorMessage(attempts >= 5 ? t("accountLocked") : (backendMsg || t("incorrectRegNoOrPassword")));
      } else {
        setErrorMessage(error.response?.data?.message || 'Unable to connect to backend.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Google Sign-In failed.");
      
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
      setErrorMessage(error.message || 'Google Sign-In failed.');
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
        <h1 style={{ fontSize: 34, marginBottom: 14, lineHeight: 1.15 }}>
          {t('studentHeadlineLine1')}<br />{t('studentHeadlineLine2')}
        </h1>
        <p style={{ opacity: 0.78, fontSize: 15 }}>
          {t('portalTagline')}
        </p>
      </div>

      <div className="login-form-panel">
        <div className="login-form-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="role-tabs">
              {ROLE_TAB_DEFS.map((tab) => {
                const label = t(tab.key);
                const displayLabel = (label === 'rolePrincipal' || label === 'roleHod') ? tab.label : label;
                return (
                  <Link key={tab.role} to={tab.path} style={{ flex: 1, textDecoration: 'none' }}>
                    <div className={'role-tab' + (tab.role === 'student' ? ' active' : '')} style={{ padding: '10px 4px', fontSize: 13, textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {displayLabel}
                    </div>
                  </Link>
                );
              })}
            </div>

            <h2 style={{ marginBottom: 6 }}>{mode === 'register' ? 'First Time Setup' : t('welcomeBackComma')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              {mode === 'register' ? 'Create your profile and secure your account' : t('studentSubheadline')}
            </p>

            <label className="field-label">{t('registerNumber')}</label>
            <input
              className="input"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. 7124102CS117"
              style={{ marginBottom: 18 }}
            />

            {mode === 'register' && (
              <div style={{ background: 'var(--bg-muted)', padding: 16, borderRadius: 8, marginBottom: 18 }}>
                <p className="text-sm" style={{ fontWeight: 600, marginBottom: 12 }}>
                  {t('firstTimeSignIn')}
                </p>
                <label className="field-label">{t('fullName')}</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priss S." style={{ marginBottom: 14 }} />
                <div className="grid-2" style={{ marginBottom: 14 }}>
                  <div>
                    <label className="field-label">{t('department')}</label>
                    <select className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
                      <option value="">{t('select')}</option>
                      {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">{t('year')}</label>
                    <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
                      <option value="">{t('select')}</option>
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <label className="field-label">{t('semester')}</label>
                <select className="input" value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="">{t('select')}</option>
                  {SEMESTERS.map((s) => <option key={s}>{s}</option>)}
                </select>
                
                <label className="field-label" style={{ marginTop: 14 }}>{t('emailAddress')}</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priss.s@nec.edu.in"
                />
              </div>
            )}

            <label className="field-label">{mode === 'register' ? 'New Password' : t('password')}</label>
            <div style={{ position: 'relative', marginBottom: mode === 'register' ? 8 : 24 }}>
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} style={{ position: 'absolute', right: 2, top: 10, border: 'none', background: 'none', cursor: 'pointer' }}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>

            {mode === 'register' && password && (
              <>
                <div className="progress-track" style={{ marginBottom: 4 }}>
                  <div className="progress-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
                </div>
                <p className="muted text-sm" style={{ marginBottom: 14 }}>
                  {t('passwordStrength')}: {strength.label} ({t('passwordHint')})
                </p>
              </>
            )}

            {mode === 'register' && (
              <>
                <label className="field-label">Confirm Password</label>
                <input
                  className="input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={{ marginBottom: 24 }}
                />
              </>
            )}

            {mode === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" /> {t('rememberMe')}
                </label>
                <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--secondary)', textDecoration: 'none', fontWeight: 500 }}>
                  {t('forgotPassword')}
                </Link>
              </div>
            )}

            {errorMessage && (
              <p className="field-error">
                {errorMessage} {failedAttempts > 0 && `(${failedAttempts} ${failedAttempts > 1 ? t('attempts') : t('attempt')})`}
              </p>
            )}

            <button className="btn btn-primary" style={{ width: '100%', marginTop: 18, padding: 14 }} disabled={loading}>
              {loading ? (mode === 'register' ? 'Registering...' : t('signingIn')) : (mode === 'register' ? 'Complete Setup & Login' : t('signIn'))}
            </button>

            <div style={{ marginTop: 16 }}>
              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
                {mode === 'login' ? "First time signing in? " : "Already have an account? "}
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrorMessage(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
                  {mode === 'login' ? "Register here" : "Sign In"}
                </button>
              </p>
            </div>

            {mode === 'login' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
                  <span style={{ padding: '0 12px', fontSize: 13, color: 'var(--text-muted)' }}>OR</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
                </div>
                <div id="googleSignInDiv" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}></div>
              </>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
