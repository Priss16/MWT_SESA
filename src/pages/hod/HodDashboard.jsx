import T from '@/components/T';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function HodDashboard() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  const [stats, setStats] = useState({ exams: 0, staff: 0, subs: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/hod');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentActivity(res.data.recentActivity);
          setUpcomingExams(res.data.upcomingExams);
        }
      } catch (error) {
        console.error('Error fetching HOD stats:', error);
      }
    };
    fetchStats();
  }, [dept]);

  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={`HOD Dashboard`} subtitle={`Department of ${dept}`} />
        <div className="page-body">
          <div className="stat-grid">
            <div className="card stat-card">
              <div className="stat-label">{t('departmentExams')}</div>
              <div className="stat-value">{stats.exams}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">{t('departmentStaff')}</div>
              <div className="stat-value">{stats.staff}</div>
            </div>
          </div>
          
          <div className="grid-2" style={{ alignItems: 'start', marginTop: 24 }}>
            <div className="card">
              <h3 style={{ marginBottom: 14 }}>{t('upcomingExams')}</h3>
              <table>
                <thead>
                  <tr><th>Code</th><th>Subject</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {upcomingExams.map(e => (
                    <tr key={e.id}>
                      <td>{e.code}</td>
                      <td>{e.subject}</td>
                      <td>{new Date(e.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {upcomingExams.length === 0 && <tr><td colSpan="3" className="muted text-center" style={{padding: 10}}>No upcoming exams</td></tr>}
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
              {recentActivity.length === 0 && <p className="muted" style={{padding: 10}}>No recent activity</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
