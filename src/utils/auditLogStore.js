import { auditLogsSeed } from '../data/mockData';

// ============================================================
// Persists Audit Logs to localStorage, the same way staffDirectoryStore
// does for the staff list. Without this, every login recorded via
// addAuditLog() lived only in React state - a page refresh (or simply
// navigating to a fresh tab) reset the log back to the static seed
// data, making it look like logins "weren't showing up" even though
// they briefly had been.
// ============================================================

const STORAGE_KEY = 'sesa_audit_logs';

export function loadAuditLogs() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to seed data
  }
  return auditLogsSeed;
}

export function saveAuditLogs(logs) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
