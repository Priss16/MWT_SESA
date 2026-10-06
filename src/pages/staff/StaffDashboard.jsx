import { useState, useEffect } from 'react';
import T from '@/components/T';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { t } = useSettings();
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDuties() {
      try {
        const res = await api.get('/invigilations/my');
        if (res.data.success) {
          setDuties(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching staff duties", err);
      } finally {
        setLoading(false);
      }
    }
    loadDuties();
  }, []);

  const attended = duties.filter((d) => d.exam_status === 'completed');
  
  const now = new Date();
  
  // Find current duty (exam is happening today, roughly right now)
  const current = duties.find(d => {
    const examDate = new Date(d.exam_date);
    return d.exam_status === 'published' && examDate.toDateString() === now.toDateString();
  });
  
  // Find next duty (upcoming exam)
  const next = duties.find(d => {
    const examDate = new Date(d.exam_date);
    return d.exam_status === 'published' && examDate > now;
  });

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={`${t('welcome')}, ${user?.name || t('staffMember')}`} subtitle={t('dashboard')} />
        <div className="page-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="stat-grid">
                <div className="card stat-card"><div className="stat-label">Halls Attended</div><div className="stat-value">{attended.length}</div><div className="stat-sub" style={{ color: 'var(--text-muted)' }}>So far this semester</div></div>
                <div className="card stat-card"><div className="stat-label">Next Duty</div><div className="stat-value" style={{ fontSize: 20 }}>{next ? new Date(next.exam_date).toLocaleDateString() : '—'}</div><div className="stat-sub" style={{ color: 'var(--text-muted)' }}>{next ? `${next.hall_name} · ${next.start_time}` : 'None scheduled'}</div></div>
                <div className="card stat-card"><div className="stat-label">Students (Current Hall)</div><div className="stat-value">{current ? '...' : 0}</div></div>
                <div className="card stat-card"><div className="stat-label">{t('notifications')}</div><div className="stat-value">0</div></div>
              </div>

              {current && (
                <div className="card" style={{ marginBottom: 24, borderColor: 'var(--secondary)', borderWidth: 1.5 }}>
                  <p className="muted text-sm" style={{ fontWeight: 600 }}>CURRENT DUTY</p>
                  <h3 style={{ margin: '8px 0' }}>{current.subject_name} ({current.subject_code})</h3>
                  <p className="muted text-sm">{current.building} · {current.hall_name}</p>
                  <p className="muted text-sm">{new Date(current.exam_date).toLocaleDateString()} · {current.start_time}</p>
                  <span className="badge badge-success" style={{ marginTop: 8, display: 'inline-block' }}>In Progress</span>
                </div>
              )}

              <div className="card">
                <h3 style={{ marginBottom: 16 }}>Halls Attended So Far</h3>
                <table>
                  <thead><tr><th>Exam</th><th>{t('hall')}</th><th>{t('date')}</th><th>Time</th></tr></thead>
                  <tbody>
                    {attended.map((d) => (
                      <tr key={d.invigilation_id}>
                        <td>{d.subject_name} ({d.subject_code})</td>
                        <td>{d.building} · {d.hall_name}</td>
                        <td>{new Date(d.exam_date).toLocaleDateString()}</td>
                        <td><span className="badge badge-muted">{d.start_time}</span></td>
                      </tr>
                    ))}
                    {attended.length === 0 && (
                      <tr><td colSpan={4} className="muted text-sm">No halls attended yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
