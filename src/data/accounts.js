// ============================================================
// Fixed Admin account + staff login rules for real login validation.
//
// SESA has no backend/database, so in a real deployment these
// records (and password checks) would live behind an auth API.
//
// There's only ever meant to be one Admin (the Examination Cell),
// so that account is fixed here. Staff are different - they're
// added dynamically via Admin > Add Staff - so instead of a second
// hardcoded list, every staff member's login is derived from the
// live staff directory (src/utils/staffDirectoryStore.js) plus the
// formula below, so anyone added through the app can log in
// immediately, not just a fixed starting five.
//
// Passwords can change at runtime (Change Password page, or a
// forgot-password reset) - see src/utils/accountStore.js, which
// layers those changes on top of the defaults below inside
// localStorage, without editing this file.
// ============================================================

export const ADMIN_ACCOUNTS = [
  {
    id: 'admin@nec.edu.in',
    staffId: 'ADM-0001',
    name: 'J. Arun',
    email: 'admin@nec.edu.in',
    label: 'Examination Cell Admin',
    password: 'Exam@2026',
  },
];

// Every staff member's starting password, before any reset/change:
// "Staff@" + the last 4 digits of their Staff ID (e.g. STF-1042 ->
// Staff@1042). This is a stand-in for what a real system would do -
// generate and email a one-time temporary password when the account
// is created - kept deterministic here so it's easy to demo without
// needing an inbox. New hires should change it after first login.
export function defaultStaffPassword(staffId) {
  const digits = (staffId.match(/\d+/g) || []).join('');
  const last4 = digits.slice(-4).padStart(4, '0');
  return `Staff@${last4}`;
}

