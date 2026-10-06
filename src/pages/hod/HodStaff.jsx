import React from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function HodStaff() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  
  const staff = [
    { id: 1001, name: 'Dr. Alan Turing', designation: 'Professor', availability: 'Available', invigilation: 2, subStatus: 'None' },
    { id: 1002, name: 'Grace Hopper', designation: 'Assistant Professor', availability: 'On Leave', invigilation: 0, subStatus: 'Pending' },
    { id: 1003, name: 'Ada Lovelace', designation: 'Associate Professor', availability: 'Assigned', invigilation: 4, subStatus: 'None' },
  ];

  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('staff')} subtitle={`Department of ${dept}`} />
        <div className="page-body">
          <div className="card">
            <table>
              <thead>
                <tr><th>Staff Name</th><th>Staff ID</th><th>Designation</th><th>{t('availability')}</th><th>Invigilation Duties</th><th>Substitution Status</th></tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td><td>{s.id}</td><td>{s.designation}</td>
                    <td><span className={`badge ${s.availability === 'Available' ? 'badge-success' : s.availability === 'On Leave' ? 'badge-danger' : 'badge-primary'}`}>{s.availability}</span></td>
                    <td>{s.invigilation}</td>
                    <td><span className="muted">{s.subStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
