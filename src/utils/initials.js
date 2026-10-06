// Turns a display name into 1-2 letter avatar initials, stripping
// common titles (Dr., Mr., Ms., Mrs.) so e.g. "Dr. K. Meenakshi" ->
// "KM" instead of "DK". Falls back to a generic placeholder when
// there's no name yet (still loading, or an edge-case account).
export function getInitials(name, fallback = 'U') {
  if (!name) return fallback;
  const cleaned = name.replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}
