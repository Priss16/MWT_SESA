import T from '@/components/T';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar, { PRINCIPAL_LINK_KEYS } from '../../components/Sidebar';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function PrincipalDashboard() {
  const { t } = useSettings();
  const [stats, setStats] = useState({ depts: 0, exams: 0, halls: 0, staff: 0, subs: 0 });
  const [recentExams, setRecentExams] = useState([]);
  const [recentSubs, setRecentSubs] = useState([]);

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/principal');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentExams(res.data.upcomingExams);
          setRecentSubs(res.data.recentSubs);
          setRecentActivity(res.data.recentActivity);
        }
      } catch (error) {
        console.error('Error fetching principal stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar links={PRINCIPAL_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('principalDashboard')} subtitle="Overview" />
        <div className="page-body">
          <div className="stat-grid">
            <div className="card stat-card">
              <div className="stat-label">{t('totalDepartments')}</div>
              <div className="stat-value">{stats.depts}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('totalExams')}</div>
              <div className="stat-value">{stats.exams}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('totalHalls')}</div>
              <div className="stat-value">{stats.halls}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('totalStaff')}</div>
              <div className="stat-value">{stats.staff}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('pendingSubstitutions')}</div>
              <div className="stat-value">{stats.subs}</div>
            </div>
          </div>
          
          <div className="grid-2" style={{ alignItems: 'start', marginTop: 24 }}>
            <div className="card">
              <div className="page-title-row" style={{ marginBottom: 12 }}>
                <h3>{t('upcomingExams')}</h3>
                <Link to="/principal/exams" style={{ fontSize: 13, color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>{t('viewAll')}</Link>
              </div>
              <table>
                <thead>
                  <tr><th>{t('subject')}</th><th>Code</th><th>Dept</th><th>{t('date')}</th><th>{t('time')}</th><th>{t('status')}</th></tr>
                </thead>
                <tbody>
                  {recentExams.map(e => (
                    <tr key={e.id}>
                      <td>{e.subject}</td><td>{e.code}</td><td>{e.dept}</td><td>{new Date(e.date).toLocaleDateString()}</td><td>{e.time}</td>
                      <td><span className="badge badge-primary">{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="page-title-row" style={{ marginBottom: 12 }}>
                <h3>Recent Substitutions</h3>
                <Link to="/principal/substitution-requests" style={{ fontSize: 13, color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>{t('viewAll')}</Link>
              </div>
              <table>
                <thead>
                  <tr><th>Dept</th><th>{t('originalStaff')}</th><th>Replacement</th><th>Exam</th><th>{t('status')}</th></tr>
                </thead>
                <tbody>
                  {recentSubs.map(s => (
                    <tr key={s.id}>
                      <td>{s.department}</td><td>{s.originalStaff}</td><td>{s.replacementStaff}</td><td>{s.exam}</td>
                      <td><span className={`badge ${s.finalStatus.includes('Approved') ? 'badge-success' : 'badge-warning'}`}>{s.finalStatus}</span></td>
                    </tr>
                  ))}
                  {recentSubs.length === 0 && <tr><td colSpan="5" className="muted" style={{textAlign: 'center', padding: 12}}>No recent requests</td></tr>}
                </tbody>
              </table>
            </div>
            
            <div className="card">
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
      </div>
    </div>
  );
}
