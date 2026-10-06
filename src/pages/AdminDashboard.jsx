import T from '@/components/T';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import api from '../services/api';

const DEPT_COLORS = { CSE: '#1E3A8A', ECE: '#2563EB', MECH: '#10B981', IT: '#F59E0B', EEE: '#EF4444' };
const STATUS_BADGE = { Published: 'badge-success', Draft: 'badge-warning', 'Not started': 'badge-muted' };

export default function AdminDashboard() {
  const { t } = useSettings();
  const { notifications } = useData();

  // ---------------- useState: OBJECT STATE ----------------
  const [stats, setStats] = useState(null); // null until "fetched"

  // ---------------- useState: BOOLEAN STATE ----------------
  const [loading, setLoading] = useState(true);

  // ---------------- useRef ----------------
  // Counts how many times this component has rendered WITHOUT causing
  // a re-render itself (a plain useState counter here would cause an
  // infinite loop, since updating it would re-render, which would
  // update it again...). useRef survives re-renders silently.
  const renderCount = useRef(0);
  renderCount.current += 1;

  const [deptBreakdown, setDeptBreakdown] = useState([]);
  const [hallUtilization, setHallUtilization] = useState({ assigned: 0, free: 0, pct: 0 });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        if (res.data.success) {
          setStats(res.data.stats);
          setDeptBreakdown(res.data.deptBreakdown);
          setHallUtilization(res.data.hallUtilization);
          setUpcomingExams(res.data.upcomingExams);
          setRecentNotifications(res.data.notifications);
          setRecentActivity(res.data.recentActivity);
        }
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('dashboard')} subtitle={t('dashboard')} />
        <div className="page-body">
          {loading || !stats ? (
            <p>Loading dashboard…</p>
          ) : (
            <>
              <div className="stat-grid" style={{ marginBottom: 16 }}>
                <div className="card stat-card">
                  <div className="stat-label">Total Students</div>
                  <div className="stat-value">{stats.totalStudents.toLocaleString()}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Total Staff</div>
                  <div className="stat-value">{stats.totalStaff.toLocaleString()}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Total Departments</div>
                  <div className="stat-value">{stats.totalDepartments}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Total Exams</div>
                  <div className="stat-value">{stats.totalExams}</div>
                </div>
              </div>
              <div className="stat-grid">
                <div className="card stat-card">
                  <div className="stat-label">Total Halls</div>
                  <div className="stat-value">{stats.totalHalls}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Available Halls</div>
                  <div className="stat-value">{stats.totalAvailableHalls}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Allocated Halls</div>
                  <div className="stat-value">{stats.totalAllocatedHalls}</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-label">Upcoming Exams</div>
                  <div className="stat-value">{stats.upcomingExams}</div>
                </div>
              </div>

              <div className="grid-2" style={{ alignItems: 'start', marginBottom: 20 }}>
                {/* Bar chart: students by department */}
                <div className="card">
                  <h3 style={{ marginBottom: 20 }}>{t('studentsByDepartment')}</h3>
                  {deptBreakdown.map(({ dept, count, pct }) => (
                    <div key={dept} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ fontWeight: 500 }}>{dept}</span>
                        <span className="muted">{count} students</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: DEPT_COLORS[dept] || 'var(--primary)' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Donut: hall utilization */}
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: 20, textAlign: 'left' }}>{t('hallUtilization')}</h3>
                  <div
                    style={{
                      width: 160, height: 160, borderRadius: '50%', margin: '0 auto 20px',
                      background: `conic-gradient(var(--primary) 0% ${hallUtilization.pct}%, #E5E7EB ${hallUtilization.pct}% 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                    }}
                  >
                    <div style={{ width: 108, height: 108, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <strong style={{ fontSize: 24 }}>{hallUtilization.pct}%</strong>
                      <span className="muted text-sm">in use</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                    <span className="text-sm"><span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--primary)', display: 'inline-block', marginRight: 6 }} />Assigned ({hallUtilization.assigned})</span>
                    <span className="text-sm"><span style={{ width: 10, height: 10, borderRadius: 5, background: '#E5E7EB', display: 'inline-block', marginRight: 6 }} />Free ({hallUtilization.free})</span>
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ alignItems: 'start' }}>
                {/* Upcoming exams table */}
                <div className="card">
                  <div className="page-title-row" style={{ marginBottom: 12 }}>
                    <h3>{t('upcomingExams')}</h3>
                    <Link to="/admin/exams" style={{ fontSize: 13, color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>{t('viewAll')}</Link>
                  </div>
                  <table>
                    <thead><tr><th>{t('subject')}</th><th>{t('date')}</th><th>{t('status')}</th></tr></thead>
                    <tbody>
                      {upcomingExams.map((e) => (
                        <tr key={e.id}>
                          <td>{e.subject}</td>
                          <td className="muted">{new Date(e.date).toLocaleDateString()}</td>
                          <td><span className={'badge ' + STATUS_BADGE[e.status]}>{e.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Notifications + quick actions */}
                <div>
                  <div className="card" style={{ marginBottom: 16 }}>
                    <div className="page-title-row" style={{ marginBottom: 12 }}>
                      <h3>{t('notifications')}</h3>
                      <Link to="/admin/notifications" style={{ fontSize: 13, color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>{t('viewAll')}</Link>
                    </div>
                    {recentNotifications.map((n) => (
                      <div key={n.id} style={{ padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</p>
                        <p className="muted text-sm">{n.time}</p>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <h3 style={{ marginBottom: 14 }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Link to="/admin/exams/add"><button className="btn btn-primary">+ Add Exam</button></Link>
                      <Link to="/admin/students/add"><button className="btn btn-ghost">+ Add Student</button></Link>
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: 16 }}>
                    <h3 style={{ marginBottom: 14 }}>{t('recentActivity')}</h3>
                    {recentActivity.map((item) => (
                      <Link key={item.id} to={item.link} style={{ display: 'block', padding: '10px 0', borderTop: '1px solid var(--border)', textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{item.type === 'hall' ? '🚪' : item.type === 'exam' ? '📄' : '🧑‍🎓'}</span>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.title}</p>
                            <p className="muted text-sm" style={{ textTransform: 'capitalize' }}>{item.type}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
