import { initialStaff } from '../data/mockData';

// ============================================================
// Persists the staff directory (Admin > Staff / Add Staff) to
// localStorage, keyed the same way AuthContext persists the logged-in
// user. Without this, DataContext's in-memory `staff` state reset to
// the original 5 seed staff on every page reload - anyone added via
// "Add Staff" would vanish the moment the tab refreshed.
//
// accountStore.js reads this same directory to decide who's allowed
// to log in as Staff, so adding someone here also gives them a real,
// working login (see src/data/accounts.js for how their default
// password is derived from their Staff ID).
// ============================================================

const STORAGE_KEY = 'sesa_staff_directory';

export function loadStaffDirectory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to seed data
  }
  return initialStaff;
}

export function saveStaffDirectory(staff) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
}
