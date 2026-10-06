import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import Header from '../../components/Header';
import api from '../../services/api';

export default function StaffSeatingView() {
  const { t } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const duty = location.state || null;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!duty) return;
    async function loadStudents() {
      try {
        const res = await api.get(`/seating?exam_id=${duty.exam_id}`);
        if (res.data.success) {
          const hallStudents = res.data.data.filter(s => s.hall_id === duty.hall_id);
          setStudents(hallStudents);
        }
      } catch (err) {
        console.error("Error fetching students", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [duty]);

  if (!duty) {
    return (
      <div className="app-shell">
        <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
        <div className="main-content">
          <Header title={t('seatingLayout')} subtitle={`${t('assignedHalls')} / ${t('viewSeating')}`} />
          <div className="page-body">
            <div className="card">
              <p className="muted text-sm">No hall selected. Go back to Assigned Halls and choose one to view.</p>
              <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate('/staff/halls')}>← Back to Assigned Halls</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group students by department
  const groupsByDept = students.reduce((acc, student) => {
    const dept = student.department_code || 'Unknown';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(student.register_number);
    return acc;
  }, {});

  const groups = Object.keys(groupsByDept).map(dept => {
    const regs = groupsByDept[dept].sort();
    return {
      dept: dept,
      count: regs.length,
      regFrom: regs[0],
      regTo: regs[regs.length - 1]
    };
  });

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t('seatingLayout')} subtitle={`${t('assignedHalls')} / ${t('viewSeating')}`} />
        <div className="page-body">
          <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>← Back to Assigned Halls</button>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 4 }}>
                  {duty.building} · {duty.hall_name}
                </h3>
                <p className="muted text-sm">
                  {new Date(duty.exam_date).toLocaleDateString()} · <span className="badge badge-muted">Session</span> ({duty.start_time})
                </p>
                <p className="muted text-sm" style={{ marginTop: 2 }}>
                  {duty.subject_name} ({duty.subject_code}) · Your role: {duty.assignment_slot === 1 ? 'Chief Invigilator' : 'Co-Invigilator'}
                </p>
              </div>
              <p className="muted text-sm">Total {students.length} students</p>
            </div>

            {loading ? (
              <p style={{ marginTop: 18 }}>Loading seating layout...</p>
            ) : (
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {groups.length === 0 ? (
                  <p className="muted">No students assigned yet.</p>
                ) : (
                  groups.map((sp, i) => (
                    <div
                      key={i}
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 13,
                      }}
                    >
                      <strong>{sp.count} students</strong> {sp.dept ? `(${sp.dept} dept)` : ''}
                      <div className="muted text-sm" style={{ marginTop: 2 }}>
                        Reg No: {sp.regFrom} to {sp.regTo}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
