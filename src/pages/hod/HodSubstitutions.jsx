import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getSubstitutionRequests, updateSubstitutionStatus } from '../../utils/demoStore';
import { useSettings } from '../../context/SettingsContext';

export default function HodSubstitutions() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests(getSubstitutionRequests().filter(r => r.department === dept));
  }, [dept]);

  const handleAction = (id, action) => {
    const status = action === 'approve' ? 'HOD Approved' : 'HOD Rejected';
    updateSubstitutionStatus(id, 'hod', status);
    setRequests(getSubstitutionRequests().filter(r => r.department === dept));
  };

  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('substitutionRequests')} subtitle={`HOD ${dept} Level Approvals`} />
        <div className="page-body">
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>{t('originalStaff')}</th>
                  <th>Replacement</th>
                  <th>Exam</th>
                  <th>{t('date')}</th>
                  <th>HOD Status</th>
                  <th>Final Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.originalStaff}</td>
                    <td>{req.replacementStaff}</td>
                    <td>{req.exam}</td>
                    <td>{req.date}</td>
                    <td>
                      <span className={`badge ${req.hodStatus.includes('Approved') ? 'badge-success' : req.hodStatus.includes('Rejected') ? 'badge-danger' : 'badge-warning'}`}>
                        {req.hodStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${req.finalStatus.includes('Approved') ? 'badge-success' : req.finalStatus.includes('Rejected') ? 'badge-danger' : 'badge-warning'}`}>
                        {req.finalStatus}
                      </span>
                    </td>
                    <td>
                      {req.hodStatus === 'Pending HOD Approval' && (
                        <>
                          <button className="btn btn-primary" style={{marginRight: 8}} onClick={() => handleAction(req.id, 'approve')}>{t('approve')}</button>
                          <button className="btn btn-ghost" onClick={() => handleAction(req.id, 'reject')}>{t('reject')}</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan="7" className="muted" style={{textAlign: 'center', padding: 20}}>No pending requests for {dept}.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
