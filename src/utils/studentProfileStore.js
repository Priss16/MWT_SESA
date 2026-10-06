const STORAGE_KEY = 'sesa_student_profiles';

function readAll() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// Returns { name, dept, year, semester, email, password } for a
// register number that has completed onboarding before, or null if
// this register number hasn't been seen on this device yet.
export function getStudentProfile(regNo) {
  if (!regNo) return null;
  return readAll()[regNo] || null;
}

// Merges into any existing record instead of overwriting it, so
// saving profile fields (name/dept/etc.) never wipes out a password
// that was set separately, and vice versa.
export function saveStudentProfile(regNo, profile) {
  if (!regNo) return;
  const all = readAll();
  all[regNo] = { ...(all[regNo] || {}), ...profile };
  writeAll(all);
}

export function setStudentPassword(regNo, password) {
  if (!regNo) return;
  const all = readAll();
  all[regNo] = { ...(all[regNo] || {}), password };
  writeAll(all);
}

// All student profiles known on this device, with regNo attached -
// used by accountStore.js to validate logins/resets and by Forgot
// Password to find a matching student account.
export function listStudentProfiles() {
  const all = readAll();
  return Object.entries(all).map(([regNo, profile]) => ({ regNo, ...profile }));
}
