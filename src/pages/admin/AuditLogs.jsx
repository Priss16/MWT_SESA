import { useState, useMemo, useCallback } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';

export default function AuditLogs() {
  const { t } = useSettings();
  // ---------------- useState: STRING STATE ----------------
  const [search, setSearch] = useState('');
  const { auditLogs } = useData();

  // ---------------- useMemo ----------------
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return auditLogs;
    return auditLogs.filter(
      (log) => log.user.toLowerCase().includes(term) || log.action.toLowerCase().includes(term) || log.details.toLowerCase().includes(term)
    );
  }, [search, auditLogs]);

  // ---------------- useCallback ----------------
  // Builds a real CSV (opens in Excel) of whatever rows are currently
  // visible (respects the search filter) and downloads it via a Blob.
  const handleExport = useCallback(() => {
    const header = ['Timestamp', 'User', 'Module', 'Details'];
    const rows = filtered.map((log) => [log.timestamp, log.user, log.action, log.details]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sesa-audit-logs.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('auditLogs')} subtitle={t('auditLogs')} />
        <div className="page-body">
          <div className="page-title-row">
            <input className="input" style={{ maxWidth: 320 }} placeholder="Search by user or action" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-secondary" onClick={handleExport}>Export CSV</button>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>{t('timestamp')}</th><th>{t('user')}</th><th>Module</th><th>{t('details')}</th></tr></thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id}>
                    <td className="muted">{log.timestamp}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td>{log.details}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No log entries match "{search}"</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
