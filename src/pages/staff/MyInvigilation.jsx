import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function MyInvigilation() {
  const { t } = useSettings();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/invigilations/my');
      if (res.data.success) {
        setAssignments(res.data.data || []);
      } else {
        setErrorMessage(res.data.message || 'Failed to load assignments');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t('myInvigilation')} subtitle="Assigned Duties" />
        <div className="page-body">
          {errorMessage && <p className="field-error" style={{marginBottom: 16}}>{errorMessage}</p>}
          <div className="card">
            {loading ? <p className="muted" style={{padding: 20}}>Loading assignments...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>{t('date')}</th>
                    <th>Time</th>
                    <th>{t('hall')}</th>
                    <th>{t('status')}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.invigilation_id}>
                      <td>{a.subject_name} ({a.subject_code})</td>
                      <td>{new Date(a.exam_date).toLocaleDateString()}</td>
                      <td>{a.start_time} - {a.end_time}</td>
                      <td>{a.hall_number}</td>
                      <td>
                        <span className={`badge ${a.assignment_status === 'assigned' ? 'badge-primary' : 'badge-warning'}`}>
                          {a.assignment_status}
                        </span>
                      </td>
                      <td>
                        {a.assignment_status === 'assigned' && (
                          <Link 
                            to={`/staff/substitution-requests/new?invigilation_id=${a.invigilation_id}&exam=${encodeURIComponent(a.subject_name)}`} 
                            className="btn btn-ghost" 
                            style={{fontSize: 12, padding: '4px 8px'}}
                          >
                            {t('requestSubstitute')}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                  {assignments.length === 0 && <tr><td colSpan="6" className="muted" style={{textAlign: 'center', padding: 20}}>No invigilation duties assigned.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
