import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useEffect } from 'react';
import api from '../../services/api';
import { useData } from '../../context/DataContext';
import { statusLabel } from '../../utils/statusLabel';

// EEE, ECE, and AIDS don't run a separate exam slot per semester -
// they pair semesters into shared sessions instead (odd sems together,
// even sems together), splitting each hall's seats between the paired
// semesters. See the Hall Plan page for the full register-number
// breakdown per hall.
const pairedSemesterDepts = ['EEE', 'ECE', 'AIDS'];
const semesterPairs = [
  ['V Sem', 'III Sem'],
  ['VI Sem', 'IV Sem', 'II Sem'],
];

export default function Departments() {
  const { t } = useSettings();
  const { halls } = useData();
  const [openDept, setOpenDept] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const hallsForDept = (code) => halls.filter((h) => h.depts?.includes(code));

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('departments')} subtitle={t('departments')} />
        <div className="page-body">
          <div className="feature-grid">
            {departments.map((d) => {
              const isOpen = openDept === d.code;
              const deptHalls = hallsForDept(d.code);

              return (
                <div
                  className="card"
                  key={d.code}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpenDept(isOpen ? null : d.code)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="icon-bubble" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{d.code}</div>
                    <span className="muted text-sm">{isOpen ? '▲' : '▼'}</span>
                  </div>
                  <h3 style={{ fontSize: 16, marginTop: 10, marginBottom: 6 }}>{d.name}</h3>
                  <p className="muted text-sm">{d.students} {t('students').toLowerCase()} · {d.staff} {t('staffWord')}</p>
                  <p className="muted text-sm">{t('hod')}: {d.hod || 'Unassigned'}</p>

                  {isOpen && (
                    <div
                      style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="muted text-sm" style={{ marginBottom: 10, fontWeight: 600 }}>
                        {t('allocatedHalls')}
                      </p>

                      {deptHalls.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: d.code === 'EEE' ? 14 : 0 }}>
                          {deptHalls.map((h) => (
                            <div
                              key={h.name}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: '6px 10px',
                              }}
                            >
                              <strong style={{ fontSize: 13 }}>{h.name}</strong>
                              {h.depts.length > 1 && (
                                <span className="muted text-sm" style={{ fontSize: 11 }}>({t('shared')})</span>
                              )}
                              <span className={'badge ' + (h.status === 'Free' ? 'badge-success' : 'badge-warning')}>
                                {statusLabel(t, h.status)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {pairedSemesterDepts.includes(d.code) && (
                        <p className="muted text-sm" style={{ marginTop: deptHalls.length > 0 ? 10 : 0, marginBottom: 10 }}>
                          {t('sharedSemesterNote')}
                          ({semesterPairs.map((p) => p.join(' \u2194 ')).join(' · ')}).
                        </p>
                      )}

                      <Link
                        to={`/admin/hall-plan?dept=${d.code}`}
                        className="btn btn-ghost"
                        style={{ fontSize: 13, padding: '6px 14px', textDecoration: 'none', display: 'inline-block' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('viewHallPlan')} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
