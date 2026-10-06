import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import Sidebar, { PRINCIPAL_LINK_KEYS } from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';

export default function PrincipalSubstitutions() {
  const { t } = useSettings();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadRequests = useCallback(async () => {
    const token = window.localStorage.getItem('sesa_token');
    if (!token) {
      setErrorMessage('Your session has expired.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/invigilation-substitutions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to load requests');
      setRequests(result.data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (id, action) => {
    const token = window.localStorage.getItem('sesa_token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/invigilation-substitutions/${id}/${action}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ remarks: `Principal ${action}d` })
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Action failed');
      
      // Reload list after success
      loadRequests();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar links={PRINCIPAL_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('substitutionRequests')} subtitle="Principal Level Approvals" />
        <div className="page-body">
          {errorMessage && <p className="field-error" style={{marginBottom: 16}}>{errorMessage}</p>}
          <div className="card">
            {loading ? <p className="muted" style={{padding: 20}}>Loading requests...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>{t('originalStaff')}</th>
                    <th>Replacement</th>
                    <th>Reason</th>
                    <th>Exam</th>
                    <th>{t('date')}</th>
                    <th>{t('hall')}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id}>
                      <td>{req.requester_name}</td>
                      <td>{req.replacement_name}</td>
                      <td>{req.reason}</td>
                      <td>{req.subject_name} ({req.subject_code})</td>
                      <td>{new Date(req.exam_date).toLocaleDateString()}</td>
                      <td>{req.hall_number}</td>
                      <td>
                        {req.status === 'pending' ? (
                          <>
                            <button className="btn btn-primary" style={{marginRight: 8}} onClick={() => handleAction(req.id, 'approve')}>{t('approve')}</button>
                            <button className="btn btn-ghost" onClick={() => handleAction(req.id, 'reject')}>{t('reject')}</button>
                          </>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className={'badge ' + (req.status === 'approved' ? 'badge-success' : 'badge-danger')} style={{ width: 'fit-content' }}>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                            {req.principal_remarks && <small className="muted">{req.principal_remarks}</small>}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan="7" className="muted" style={{textAlign: 'center', padding: 20}}>No pending requests at Principal level.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
