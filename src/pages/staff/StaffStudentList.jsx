import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import Header from '../../components/Header';
import api from '../../services/api';

export default function StaffStudentList() {
  const { t } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const duty = location.state || null;

  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!duty) return;
    async function loadStudents() {
      try {
        const res = await api.get(`/seating?exam_id=${duty.exam_id}`);
        if (res.data.success) {
          // Filter out students who are in the specific hall we are viewing
          const hallStudents = res.data.data.filter(s => s.hall_id === duty.hall_id);
          setStudents(hallStudents);
          setAttendance(Object.fromEntries(hallStudents.map((s) => [s.student_id, true])));
        }
      } catch (err) {
        console.error("Error fetching students", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [duty]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((s) => s.student_name.toLowerCase().includes(term) || s.register_number.toLowerCase().includes(term));
  }, [search, students]);

  function toggleAttendance(id) {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const handlePrint = useCallback(() => {
    const rows = filtered
      .map(
        (s) => `
        <tr>
          <td>${s.register_number}</td>
          <td>${s.student_name}</td>
          <td>${s.seat_row}${s.seat_column}</td>
          <td>${attendance[s.student_id] ? 'Present' : 'Absent'}</td>
        </tr>`
      )
      .join('');

    const html = `
      <html>
        <head>
          <title>Student List — ${duty.building} ${duty.hall_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #1F2937; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            p { color: #6B7280; font-size: 13px; margin-top: 0; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
            th { color: #6B7280; text-transform: uppercase; font-size: 11px; }
          </style>
        </head>
        <body>
          <h1>Student List — ${duty.building} ${duty.hall_name}</h1>
          <p>${duty.subject_name} (${duty.subject_code}) · Printed ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>Register No.</th><th>Name</th><th>${t('seat')}</th><th>Attendance</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow pop-ups for this site to print the student list.');
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }, [filtered, attendance, duty, t]);

  if (!duty) {
    return (
      <div className="app-shell">
        <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
        <div className="main-content">
          <Header title={t('studentList')} subtitle="Not Found" />
          <div className="page-body">
            <div className="card">
              <p className="muted text-sm">No duty selected. Go back to Assigned Halls and choose one to view.</p>
              <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate('/staff/halls')}>← Back to Assigned Halls</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={`${t('studentList')} — ${duty.hall_name}`} subtitle={`${duty.subject_name} (${duty.subject_code}) / ${duty.hall_name}`} />
        <div className="page-body">
          <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>← Back to Assigned Halls</button>
          <div className="page-title-row">
            <input className="input" style={{ maxWidth: 320 }} placeholder="Search within this hall" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-ghost" onClick={handlePrint} disabled={loading || students.length === 0}>Print List</button>
          </div>
          <div className="card">
            {loading ? (
              <p>Loading students...</p>
            ) : students.length === 0 ? (
              <p className="muted">No students assigned to this hall for this exam.</p>
            ) : (
              <table>
                <thead><tr><th>Register No.</th><th>Name</th><th>{t('seat')}</th><th>Attendance</th></tr></thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.student_id}>
                      <td>{s.register_number}</td>
                      <td>{s.student_name}</td>
                      <td>{s.seat_row}{s.seat_column}</td>
                      <td>
                        <button
                          className={'badge ' + (attendance[s.student_id] ? 'badge-success' : 'badge-danger')}
                          style={{ border: 'none', cursor: 'pointer' }}
                          onClick={() => toggleAttendance(s.student_id)}
                        >
                          {attendance[s.student_id] ? 'Present' : 'Absent'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
