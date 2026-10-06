// Scores a password on 4 simple rules - length, uppercase letter,
// number, special character - and maps the score to a Weak/Medium/
// Strong label with a progress-bar percentage and color.
export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', pct: 25, color: 'var(--danger)' };
  if (score <= 2) return { label: 'Medium', pct: 60, color: 'var(--warning)' };
  return { label: 'Strong', pct: 100, color: 'var(--success)' };
}
