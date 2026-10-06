import { ADMIN_ACCOUNTS, defaultStaffPassword } from '../data/accounts';
import { loadStaffDirectory } from './staffDirectoryStore';
import { listStudentProfiles, getStudentProfile, setStudentPassword } from './studentProfileStore';

// ============================================================
// Real credential checking for Admin, Staff, and Student, all built
// on the same rules:
//   - Admin/Staff passwords start at a known default (see
//     src/data/accounts.js) and can be overridden by a password
//     change or reset - overrides live in localStorage.
//   - Student passwords have no fixed default (students self-
//     provision on first login) - whatever they set at signup is
//     stored directly on their profile record.
//   - Login lockouts: 5 wrong passwords for the same account locks
//     it for a minute, like a real portal.
//   - Password resets use one-time tokens (see the bottom of this
//     file), not a randomly emailed password - Forgot Password
//     creates a token, Reset Password redeems it for a password the
//     person chooses themselves.
//
// IMPORTANT CAVEAT: SESA has no backend/database - everything here
// lives in this browser's localStorage. A password reset, a changed
// password, or a newly self-provisioned student account only exists
// on the device/browser it was created on.
// ============================================================

const OVERRIDES_KEY = 'sesa_password_overrides'; // admin/staff only
const LOCKOUT_KEY = 'sesa_login_lockouts';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 1 minute
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes, like most real reset links

function readJSON(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getAccounts(role) {
  if (role === 'admin') return ADMIN_ACCOUNTS;
  if (role === 'staff') {
    // Sourced from the live staff directory (Admin > Staff / Add
    // Staff), not a separate fixed list - so anyone added through the
    // app can log in immediately with their default password.
    return loadStaffDirectory().map((s) => ({
      id: s.staffId,
      name: s.name,
      email: s.email,
      dept: s.dept,
      designation: s.designation,
      password: defaultStaffPassword(s.staffId),
    }));
  }
  if (role === 'student') {
    // Sourced from whichever students have signed in on this device
    // before - there's no fixed roster, since real register numbers
    // vary per student.
    return listStudentProfiles().map((p) => ({
      id: p.regNo,
      name: p.name,
      email: p.email,
      dept: p.dept,
      year: p.year,
      semester: p.semester,
      password: p.password,
    }));
  }
  return [];
}

function findAccount(role, identifier) {
  if (!identifier) return null;
  const needle = identifier.trim().toLowerCase();
  return (
    getAccounts(role).find(
      (acc) => acc.id.toLowerCase() === needle || (acc.email && acc.email.toLowerCase() === needle)
    ) || null
  );
}

// Looks up an identifier across admin, staff, and student accounts -
// used by Forgot Password, which doesn't know the role up front.
export function findAccountAcrossRoles(identifier) {
  for (const role of ['admin', 'staff', 'student']) {
    const account = findAccount(role, identifier);
    if (account) return { role, account };
  }
  return null;
}

function getCurrentPassword(role, account) {
  if (role === 'student') {
    // A student's password lives directly on their own profile
    // record - there's no separate "default" to fall back to.
    return getStudentProfile(account.id)?.password ?? account.password ?? null;
  }
  const overrides = readJSON(OVERRIDES_KEY, {});
  return overrides[role]?.[account.id] ?? account.password;
}

export function setPassword(role, id, newPassword) {
  if (role === 'student') {
    setStudentPassword(id, newPassword);
    return;
  }
  const overrides = readJSON(OVERRIDES_KEY, {});
  overrides[role] = overrides[role] || {};
  overrides[role][id] = newPassword;
  writeJSON(OVERRIDES_KEY, overrides);
}

export function verifyCredentials(role, identifier, password) {
  const account = findAccount(role, identifier);
  if (!account) return { ok: false, reason: 'not-found' };
  const current = getCurrentPassword(role, account);
  if (!current || current !== password) return { ok: false, reason: 'bad-password' };
  return { ok: true, account };
}

function lockKey(role, identifier) {
  return `${role}:${identifier.trim().toLowerCase()}`;
}

// Returns whether this identifier is currently locked out, plus how
// many failed attempts have been recorded (reset once a lockout expires).
export function getLockStatus(role, identifier) {
  const lockouts = readJSON(LOCKOUT_KEY, {});
  const entry = lockouts[lockKey(role, identifier)];
  if (!entry) return { locked: false, attempts: 0 };
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
    return { locked: true, remainingMs: entry.lockedUntil - Date.now(), attempts: entry.attempts };
  }
  return { locked: false, attempts: entry.lockedUntil ? 0 : entry.attempts };
}

export function recordFailedAttempt(role, identifier) {
  const lockouts = readJSON(LOCKOUT_KEY, {});
  const key = lockKey(role, identifier);
  const entry = lockouts[key] || { attempts: 0, lockedUntil: null };
  // If a previous lockout has already expired, start counting fresh.
  const attempts = entry.lockedUntil && entry.lockedUntil <= Date.now() ? 1 : entry.attempts + 1;
  const lockedUntil = attempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
  const updated = { attempts, lockedUntil };
  lockouts[key] = updated;
  writeJSON(LOCKOUT_KEY, lockouts);
  return updated;
}

export function clearAttempts(role, identifier) {
  const lockouts = readJSON(LOCKOUT_KEY, {});
  delete lockouts[lockKey(role, identifier)];
  writeJSON(LOCKOUT_KEY, lockouts);
}

// ============================================================
// Password reset tokens - a real "click the link, then choose a new
// password" flow. Forgot Password issues a one-time token tied to
// whichever account matched; Reset Password redeems it.
//
// IMPORTANT: the token itself carries everything needed to validate
// it (role, id, expiry) instead of being a random string looked up in
// a table stored in THIS browser's localStorage. That table-lookup
// approach was the actual bug behind "the emailed link says invalid" -
// the token only ever existed in the localStorage of whichever
// browser clicked "Send Reset Link," so opening the emailed link on a
// phone, a different browser, or even the same browser after clearing
// storage always failed with "invalid," no matter how fresh the link
// was. Encoding the token's own data into itself means any browser
// that opens the link can validate it correctly.
//
// The trade-off: without a real backend, "used once" can only be
// enforced on whichever single device actually redeems it (that
// device remembers the token was used); a different device would
// still accept it once. That's an inherent limit of having no server,
// not something the token format can fix - but it no longer produces
// the false "invalid" result being reported.
// ============================================================

function base64UrlEncode(str) {
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  return decodeURIComponent(escape(atob(padded)));
}

const USED_TOKENS_KEY = 'sesa_used_reset_tokens';

export function createResetToken(role, id) {
  const payload = { role, id, expiresAt: Date.now() + RESET_TOKEN_TTL_MS, nonce: Math.random().toString(36).slice(2) };
  try {
    return base64UrlEncode(JSON.stringify(payload));
  } catch {
    return null;
  }
}

function decodeResetToken(token) {
  try {
    return JSON.parse(base64UrlDecode(token));
  } catch {
    return null;
  }
}

function isTokenUsed(token) {
  return !!readJSON(USED_TOKENS_KEY, {})[token];
}

function markTokenUsed(token) {
  const used = readJSON(USED_TOKENS_KEY, {});
  used[token] = true;
  writeJSON(USED_TOKENS_KEY, used);
}

// Checks a token without consuming it - used to decide what to show
// on the Reset Password page before the person submits a new password.
export function peekResetToken(token) {
  const payload = token && decodeResetToken(token);
  if (!payload || !payload.role || !payload.id) return { valid: false, reason: 'not-found' };
  if (isTokenUsed(token)) return { valid: false, reason: 'used' };
  if (payload.expiresAt < Date.now()) return { valid: false, reason: 'expired' };
  return { valid: true, role: payload.role, id: payload.id };
}

export function redeemResetToken(token, newPassword) {
  const check = peekResetToken(token);
  if (!check.valid) return check;
  setPassword(check.role, check.id, newPassword);
  markTokenUsed(token);
  return { valid: true };
}

// Used only when Admin adds a new Staff member - a starter password
// to hand over (or email) immediately, standing in for what a real
// system would generate on account creation. Unrelated to the reset
// token flow above, which is for existing accounts.
export function generateTempPassword() {
  const words = ['Exam', 'Seat', 'Hall', 'Grid', 'Slip', 'Cell'];
  const symbols = '!@#$%';
  const word = words[Math.floor(Math.random() * words.length)];
  const digits = Math.floor(1000 + Math.random() * 9000);
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  return `${word}${symbol}${digits}`;
}
