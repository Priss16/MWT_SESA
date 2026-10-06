import Sidebar from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';

function availability(duties) {
  if (duties >= 5) return { label: 'Full', cls: 'badge-danger' };
  if (duties >= 3) return { label: 'Nearly full', cls: 'badge-warning' };
  return { label: 'Available', cls: 'badge-success' };
}

export default function Invigilators() {
  const { t } = useSettings();
  const [staff, setStaff] = useState([]);
  const [invigilations, setInvigilations] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      const token = window.localStorage.getItem('sesa_token');
      if (!token) return;
      try {
        const [staffRes, invigRes] = await Promise.all([
          fetch('http://localhost:5000/api/staff', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/invigilations', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        const staffData = await staffRes.json();
        const invigData = await invigRes.json();
        
        if (staffRes.ok && staffData.success) setStaff(staffData.data || []);
        if (invigRes.ok && invigData.success) setInvigilations(invigData.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaff();
  }, []);
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('invigilators')} subtitle={t('invigilators')} />
        <div className="page-body">
          <div className="page-title-row">
            <div />
          </div>
          <div className="stat-grid">
            <div className="card stat-card"><div className="stat-label">Total Invigilators</div><div className="stat-value">{staff.length}</div></div>
            <div className="card stat-card"><div className="stat-label">On Duty This Week</div><div className="stat-value">{staff.filter((s) => (s.duties_this_week || 0) > 0).length}</div></div>
            <div className="card stat-card"><div className="stat-label">Unassigned Duties</div><div className="stat-value">N/A</div></div>
            <div className="card stat-card"><div className="stat-label">Avg. Duties / Week</div><div className="stat-value">{staff.length ? (staff.reduce((a, s) => a + (s.duties_this_week || 0), 0) / staff.length).toFixed(1) : 0}</div></div>
          </div>

          <div className="card">
            <table>
              <thead><tr><th>Staff ID</th><th>Name</th><th>{t('department')}</th><th>Designation</th><th>Active/Inactive</th><th>{t('availability')}</th><th>Current Exam</th><th>Current Hall</th><th>Date & Time</th></tr></thead>
              <tbody>
                {staff.map((s) => {
                  const myInv = invigilations.find(i => i.staff_id === s.id && i.status === 'assigned');
                  const isAllocated = !!myInv;
                  return (
                    <tr key={s.id}>
                      <td>{s.staff_id || `STF${s.id}`}</td>
                      <td>{s.name}</td>
                      <td>{s.department_code || 'Unknown'}</td>
                      <td>{s.designation || 'Staff'}</td>
                      <td><span className="badge badge-success">Active</span></td>
                      <td>
                        <span className={`badge ${isAllocated ? 'badge-warning' : 'badge-success'}`}>
                          {isAllocated ? 'ALLOCATED' : 'AVAILABLE'}
                        </span>
                      </td>
                      <td>{isAllocated ? `${myInv.subject_name} (${myInv.subject_code})` : '-'}</td>
                      <td>{isAllocated ? myInv.hall_number : '-'}</td>
                      <td>
                        {isAllocated 
                          ? `${new Date(myInv.exam_date).toLocaleDateString()} ${myInv.start_time}` 
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
