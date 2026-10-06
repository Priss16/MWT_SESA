import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function MySubstitutionRequests() {
  const { t } = useSettings();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/invigilation-substitutions/my');
      if (res.data.success) {
        setRequests(res.data.data || []);
      } else {
        setErrorMessage(res.data.message || 'Failed to load requests');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t('myRequests')} subtitle="My Substitution Requests" />
        <div className="page-body">
          {errorMessage && <p className="field-error" style={{marginBottom: 16}}>{errorMessage}</p>}
          <div className="card">
            {loading ? <p className="muted" style={{padding: 20}}>Loading requests...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>{t('date')}</th>
                    <th>{t('hall')}</th>
                    <th>Replacement</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Principal Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.request_id}>
                      <td>{req.subject_name} ({req.subject_code})</td>
                      <td>{new Date(req.exam_date).toLocaleDateString()}</td>
                      <td>{req.hall_number}</td>
                      <td>{req.replacement_name}</td>
                      <td>{req.reason}</td>
                      <td>
                        <span className={`badge ${req.status === 'approved' ? 'badge-success' : req.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>{req.principal_remarks || '-'}</td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan="7" className="muted" style={{textAlign: 'center', padding: 20}}>No substitution requests found.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
