// Status strings like 'Free', 'Assigned', 'Active', 'Published' are
// used as internal data values throughout the app - compared with
// === for logic and CSS class lookups (e.g. `status === 'Free'`), so
// they can't be translated at the source without breaking that logic.
// This maps the value to a translated DISPLAY label only, at the
// point something actually renders it on screen.
const STATUS_KEYS = {
  Free: 'free',
  Assigned: 'assigned',
  Active: 'active',
  Inactive: 'inactive',
  Published: 'published',
  Draft: 'draft',
  'Not started': 'notStarted',
  Present: 'present',
  Absent: 'absent',
};

export function statusLabel(t, status) {
  const key = STATUS_KEYS[status];
  return key ? t(key) : status;
}
