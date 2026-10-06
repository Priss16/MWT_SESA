import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import Header from '../../components/Header';
import api from '../../services/api';

export default function AssignedHalls() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDuties() {
      try {
        const res = await api.get('/invigilations/my');
        if (res.data.success) {
          setDuties(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching assigned halls", err);
      } finally {
        setLoading(false);
      }
    }
    loadDuties();
  }, []);

  const now = new Date();
  
  const currentDuty = duties.find(d => {
    const examDate = new Date(d.exam_date);
    return d.exam_status === 'published' && examDate.toDateString() === now.toDateString();
  });
  
  const upcomingDuties = duties.filter(d => {
    const examDate = new Date(d.exam_date);
    return d.exam_status === 'published' && examDate > now;
  });

  function DutyCard(d, isCurrent) {
    return (
      <div key={d.invigilation_id} className="card" style={{ marginBottom: 16, borderColor: isCurrent ? 'var(--secondary)' : 'var(--border)', borderWidth: isCurrent ? 1.5 : 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 17 }}>{d.subject_name} ({d.subject_code})</h3>
          <span className={'badge ' + (isCurrent ? 'badge-success' : 'badge-warning')}>{isCurrent ? 'Current' : 'Next'}</span>
        </div>
        <p className="muted text-sm" style={{ margin: '8px 0 16px' }}>
          {d.building} · {d.hall_name} · {new Date(d.exam_date).toLocaleDateString()} · <span className="badge badge-muted">Session</span> ({d.start_time})
        </p>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div><p className="muted text-sm">YOUR ROLE</p><strong>{d.assignment_slot === 1 ? 'Chief Invigilator' : 'Co-Invigilator'}</strong></div>
        </div>
        <div style={{ marginTop: 16, textAlign: 'right', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/staff/students', { state: d })}>Print List</button>
          <button className="btn btn-ghost" onClick={() => navigate('/staff/seating', { state: d })}>View Seating</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t('assignedHalls')} subtitle={t('assignedHalls')} />
        <div className="page-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {currentDuty && (
                <>
                  <p className="muted text-sm" style={{ marginBottom: 10, fontWeight: 600 }}>Your Current Hall</p>
                  {DutyCard(currentDuty, true)}
                </>
              )}

              {upcomingDuties.length > 0 && (
                <>
                  <p className="muted text-sm" style={{ margin: '20px 0 10px', fontWeight: 600 }}>Upcoming</p>
                  {upcomingDuties.map((d) => DutyCard(d, false))}
                </>
              )}

              {!currentDuty && upcomingDuties.length === 0 && (
                <div className="card"><p className="muted text-sm">No current or upcoming halls assigned.</p></div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
