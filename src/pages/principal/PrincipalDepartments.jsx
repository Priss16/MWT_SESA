import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar, { PRINCIPAL_LINK_KEYS } from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';

// A sub-component to fetch and render stats for a specific department
function DepartmentCard({ dept }) {
  const { t } = useSettings();
  const [stats, setStats] = useState({ subjects: 0, students: 0, staff: 0, exams: 0, halls: 0, invigilation: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = window.localStorage.getItem('sesa_token');
      if (!token) return;
      try {
        const res = await fetch(`http://localhost:5000/api/departments/${dept.id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch stats for", dept.name, err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dept.id]);

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>{dept.code} <span style={{fontSize: 14, color: '#888'}}>({dept.name})</span></h3>
        {loading ? (
          <p className="muted" style={{flex: 1}}>Loading stats...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, fontSize: 14, flex: 1 }}>
            <div><span className="muted">Subjects:</span> {stats.subjects}</div>
            <div><span className="muted">Students:</span> {stats.students}</div>
            <div><span className="muted">Staff:</span> {stats.staff}</div>
            <div><span className="muted">Exams:</span> {stats.exams}</div>
            <div><span className="muted">Halls:</span> {stats.halls}</div>
            <div><span className="muted">Invigilation:</span> {stats.invigilation}</div>
          </div>
        )}
        <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => setShowModal(true)}>{t('viewDetails')}</button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: 600}}>
            <h2>{dept.name} ({dept.code})</h2>
            <p className="muted" style={{marginBottom: 20}}>Comprehensive overview for this department</p>
            
            <div style={{display: 'flex', gap: 20, marginBottom: 20}}>
              <div className="card" style={{flex: 1, textAlign: 'center'}}>
                <div style={{fontSize: 32, fontWeight: 'bold', color: 'var(--primary-color)'}}>{stats.students}</div>
                <div className="muted" style={{fontSize: 14}}>Total Students</div>
              </div>
              <div className="card" style={{flex: 1, textAlign: 'center'}}>
                <div style={{fontSize: 32, fontWeight: 'bold', color: 'var(--primary-color)'}}>{stats.staff}</div>
                <div className="muted" style={{fontSize: 14}}>Total Staff</div>
              </div>
              <div className="card" style={{flex: 1, textAlign: 'center'}}>
                <div style={{fontSize: 32, fontWeight: 'bold', color: 'var(--primary-color)'}}>{stats.subjects}</div>
                <div className="muted" style={{fontSize: 14}}>Subjects</div>
              </div>
            </div>

            <div className="card" style={{marginBottom: 20}}>
              <h4 style={{marginBottom: 10}}>Examination Metrics</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between'}}>
                  <span>Scheduled Exams</span> <strong>{stats.exams}</strong>
                </li>
                <li style={{padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between'}}>
                  <span>Invigilation Assignments</span> <strong>{stats.invigilation}</strong>
                </li>
                <li style={{padding: '8px 0', display: 'flex', justifyContent: 'space-between'}}>
                  <span>Active Halls</span> <strong>{stats.halls}</strong>
                </li>
              </ul>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PrincipalDepartments() {
  const { t } = useSettings();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = window.localStorage.getItem('sesa_token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/departments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          setDepartments(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar links={PRINCIPAL_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('departments')} subtitle="All Departments Overview" />
        <div className="page-body">
          {loading ? (
            <p className="muted" style={{padding: 20}}>Loading departments...</p>
          ) : (
            <div className="feature-grid">
              {departments.map(dept => (
                <DepartmentCard key={dept.id} dept={dept} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
